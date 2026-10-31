import File from "./schema.js";
import {randomUUID, randomBytes} from 'crypto';
import {supabase} from '../../utils/supabase.js';


export const add_file = async(req, res) => {
    let storage_path;
    try {
        const user_id = req.user.id;
        if(!user_id){
            return res.status(400).json({success: false, message: 'Please Login and Try again'});
        };
        const file = req.file;
        if(!file){
            return res.status(400).json({success: false, message: 'No File uploaded'});
        };
        const id  = randomUUID();
        const share_token = randomBytes(32).toString('hex');
        storage_path = id;

        const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const {error: upload_error} = await supabase.storage.from('vault').upload(storage_path, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

        if(upload_error){
            throw upload_error;
        };
        const new_file = await File.create({user_id: user_id, original_name: file.originalname, storage_path, mime_type: file.mimetype, size_bytes: file.size, share_token, expires_at});
        return res.status(201).json({success: true, message: 'File Uploaded', data: new_file});
    } catch (error) {
        if(storage_path){
            try {
                const {error: cleanup_error} = await supabase.storage.from('vault').remove([storage_path]);
                if(cleanup_error){
                    console.error(`Error with cleaning up uploaded file ${storage_path}: ${cleanup_error}`);
                };
            } catch (cleanup_error) {
                console.error(`Error with cleaning up uploaded file ${storage_path}: ${cleanup_error}`);
            };
        };
        console.error(`Error with adding a new file ${error}`);
        return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};

export const get_user_files = async(req, res) => {
    try {
        const user_id = req.user.id
         if(!user_id){
            return res.status(400).json({success: false, message: 'Please Login and Try again'});
        };
        const user_files = await File.findAll({where:{user_id: user_id}});
        return res.status(200).json({success: true, message: 'User Files Fetched', data: user_files});
    } catch (error) {
        console.error(`Error with getting a users files ${error}`);
        return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};

export const get_file_by_id = async(req, res) => {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({success: false, message: 'No id Provided'});
        };
        const file = await File.findOne({where:{id, user_id: req.user.id}});
        if(!file){
            return res.status(404).json({success: false, message: 'Invalid Id'});
        };
        return res.status(200).json({success: true, message: 'File Fetched', data: file});
    } catch (error) {
        console.error(`Error with getting the file by record id ${error}`);
        return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};

export const share_file = async(req, res) => {
    try {
        const {token} = req.params;
        if(!token){
            return res.status(404).json({success: false, message: 'No token provided'});
        };
        const file = await File.findOne({where:{share_token: token}});
        if(!file || new Date(file.expires_at).getTime() <= Date.now()){
            return res.status(410).json({success: false, message: 'Expired Share Link'});
        };

        const {data, error: downloadError} = await supabase.storage.from('vault').createSignedUrl(file.storage_path, 300, {
            download: file.originalname
        });
        if(downloadError || !data?.signedUrl){
            return res.status(502).json({success: false, message: 'Unable to generate download Link'});
        };

        await file.increment('download_count');
        return res.redirect(302, data.signedUrl);
    } catch (error) {
        console.error(`Error with downloading the shared file ${error}`);
        return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};

export const deleteFile = async(req, res) => {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({success: false, message: 'No id Provided'});
        };
        const file = await File.findOne({where:{id, user_id: req.user.id}});
        if(!file){
            return res.status(404).json({success: false, message: 'Invalid Id'});
        };

        const {error: deletion_error} = await supabase.storage.from('vault').remove([file.storage_path]);
        if(deletion_error){
            console.error(`Error with deleting stored file ${file.id}: ${deletion_error}`);
            return res.status(502).json({success: false, message: 'Unable to delete file from storage'});
        };

        await file.destroy();
        return res.status(200).json({success: true, message: 'File deleted'});
    } catch (error) {
        console.error(`Error with deleting the file ${error}`);
        return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};