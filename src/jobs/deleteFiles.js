import { Op } from "sequelize";
import File from "../modules/Files/schema.js";
import { supabase } from "../utils/supabase.js";

export default async function delete_expired_files(){
    try {
        const expired_files = await File.findAll({where:{expires_at: {[Op.lte]: new Date()}}, limit: 100});
        if(!expired_files || expired_files.length === 0){
            throw new Error('Error with getting expired files, None Fetched');
            return;
        };
        for(const File of expired_files){
            const {error: deletionError} = await supabase.storage.from('vault').remove([File.storage_path]);

            if(deletionError){
                console.error(`Error with deleting file ${File.id}`);
                continue;
            };

            await File.destroy();
        };

    } catch (error) {
        console.error(`Error with deleting expired files ${error}`);
        return null;
    }
}