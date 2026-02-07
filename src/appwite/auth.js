import { Client, Account, ID, Databases } from 'appwrite';

export class AuthService {
    client = new Client();
    account;
    databases;

    constructor() {
        this.client
            .setEndpoint('https://fra.cloud.appwrite.io/v1')
            .setProject('694967040015d8c26563');

        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const user = await this.account.create(ID.unique(), email, password, name);
            if (user) {
                await this.databases.createDocument(
                    '69496f7400231e37fc97',
                    'profiles',
                    user.$id, {
                        name: name,
                        userId: user.$id,
                        email: email,
                    }
                );
                return await this.login({ email, password });
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async login({ email, password }) {
        try {
            await this.account.createEmailPasswordSession(email, password);

            const userAccount = await this.account.get();

            const userData = {
                $id: userAccount.$id,
                email: userAccount.email,
                name: userAccount.name,
            };

            localStorage.setItem('authStatus', 'true');
            localStorage.setItem('userData', JSON.stringify(userData));

            return { success: true, data: userData };
        } catch (error) {
            localStorage.clear();
            return { success: false, error: error.message };
        }
    }
    async getUser() {
        try {
            const user = await this.account.get();
            localStorage.setItem('userData', JSON.stringify(user));
            localStorage.setItem('authStatus', 'true');
            return user;
        } catch (error) {
            localStorage.removeItem('authStatus');
            localStorage.removeItem('userData');
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSession('current');
        } catch (error) {
            console.error("Logout error (likely already logged out):", error.message);
        } finally {
            localStorage.clear();
        }
        return { success: true };
    }


}
const authService = new AuthService();
export default authService;