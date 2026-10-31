import User from "./schema.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from  'dotenv';
dotenv.config();

export const user_sign_up = async(req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({success: false, message: 'Missing Fields'});
        };
        const is_user = await User.findOne({where:{email: email}});
        if(is_user){
            return res.status(404).json({success: false, message: 'Email exists'});
        };
        const hashed_password = await bcrypt.hash(password, 12);
        const user = await User.create({name, email, password: hashed_password});
        return res.status(201).json({success: true, message: 'User Created'});
    } catch (error) {
        console.error(`Error with user sign up ${error}`);
        return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};

export const sign_in = async(req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({success: false, message: 'Missing Fields'});
        };
        const is_user = await User.findOne({where:{email: email}});
        if(!is_user){
            return res.status(404).json({success: false, message: 'Email does not exist'});
        };
        const is_password = await bcrypt.compare(password, is_user.password);
        if(!is_password){
            return res.status(404).json({success: false, message: 'Invalid Password'})
        };
        const token = jwt.sign({id: is_user.id, role: is_user.role, email: is_user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        return res.status(200).json({success: true, message: 'Sign in successfully', data: token})
    } catch (error) {
        console.error(`Error with signing in ${error}`);
        return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};

export const admin_sign_up = async(req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({success: false, message: 'Missing Fields'});
        };
        const is_user = await User.findOne({where:{email: email}});
        if(is_user){
            return res.status(404).json({success: false, message: 'Email exists'});
        };
        const hashed_password = await bcrypt.hash(password, 12);
        const user = await User.create({name, email, password: hashed_password, role: 'admin'});
        return res.status(201).json({success: true, message: 'Admin Created'});
    } catch (error) {
        console.error(`Error with creating a new admin record ${error}`);
        return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};

export const get_user_by_email = async(req, res) => {
    try {
        const {email} = req.query.q;
        if(!email){
            return res.status(400).json({success: false, message: 'No email sent'});
        };
        const is_user = await User.findOne({where:{email: email}});
        if(!is_user){
            return res.status(404).json({success: false, message: 'Email does not exist'});
        };
        return res.status(200).json({success: true, message: 'User Found', data: is_user})
    } catch (error) {
        console.error(`Error with getting user record by email ${error}`);
        return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};

export const get_user_by_name = async(req, res) => {
    try {
        const {name} = req.query.q;
        if(!name){
            return res.status(400).json({success: false, message: 'No username sent'});
        };
        const is_user = await User.findOne({where:{name: name}});
        if(!is_user){
            return res.status(404).json({success: false, message: 'Username does not exist'});
        };
        return res.status(200).json({success: true, message: 'User Found', data: is_user})
    } catch (error) {
        console.error(`Error with getting user record by email ${error}`);
        return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};

export const get_user_by_id = async(req, res) => {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({success: false, message: 'Provide record id'});
        };
        const is_user = await User.findByPk(id);
        if(!is_user){
            return res.status(404).json({success: false, message: 'Invalid Id'});
        };
        return res.status(200).json({success: true, message: 'User Found', data: is_user})
    } catch (error) {
        console.error(`Error with getting the user by id ${error}`);
        return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};

export const update_user = async(req, res) => {
    try {
        const user_id = req.user.id;
        if(!user_id){
            return res.status(400).json({success: false, message: 'Please Login and Try again'});
        };
        const {name, email, password} = req.body;
        const is_user = await User.findByPk(user_id);
        if(!is_user){
            return res.status(404).json({success: false, message: 'Invalid Id'});
        };
        const hashed_password = await bcrypt.hash(password, 12);
        const updated_user = await is_user.update({name, email, password: hashed_password});
        return res.status(200).json({success: true, message: 'Updated User'});
    } catch (error) {
        console.error(`Error with updating the user record ${error}`);
        return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};

export const delete_user = async(req, res) => {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({success: false, message: 'Provide record id'});
        };
        const is_user = await User.findByPk(id);
        if(!is_user){
            return res.status(404).json({success: false, message: 'Invalid Id'});
        };
        await is_user.destroy();
        return res.status(200).json({success: true, message: 'User Deleted'});
    } catch (error) {
        console.error(`Error with deleting the user record ${error}`);
        return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
};