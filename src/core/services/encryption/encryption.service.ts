import bcrypt from "bcryptjs";

export class EncryptionService {
    static async generateHash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    static async comparePassword(password:string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}
