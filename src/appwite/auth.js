import conf from '../conf/conf.js';
import { Client, Account, ID } from 'appwrite';

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.AppwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            console.log('Creating account for:', email);
            const user = await this.account.create(ID.unique(), email, password, name);
            if (user) {
                const loginResult = await this.login({ email, password });
                if (loginResult.success) {
                    return { success: true, data: user };
                }
                return { success: false, error: 'Account created but login failed' };
            }
            return { success: false, error: 'Account creation failed' };
        } catch (error) {
            console.error('Error creating account:', error);
            return { success: false, error: error.message };
        }
    }

    async login({ email, password }) {
        try {
            console.log('Logging in:', email);
            const session = await this.account.createEmailPasswordSession(email, password);
            console.log('Session created:', session);
            localStorage.setItem('authStatus', 'true');
            localStorage.setItems('userData', JSON.stringify(user));
            const user = {
                $id: session.userId,
                email: email,
                name: email.split('@')[0],
                sessionId: session.$id
            };

            return { success: true, data: user };

        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    async getUser() {
        try {
            console.log('Getting user...');
            const user = await this.account.get();
            console.log('User retrieved:', user);
            return user;
        } catch (error) {
            console.error('Get user error:', error);
            const savedUser = localStorage.getItem('userData');
            if (savedUser) {
                console.log('Returning saved user from localStorage');
                return JSON.parse(savedUser);
            }
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSession('current');
            localStorage.removeItem('authStatus');
            localStorage.removeItem('userData');
            return { success: true };
        } catch (err) {
            console.log("Error logging out:", err);
            localStorage.removeItem('authStatus');
            localStorage.removeItem('userData');
            return { success: false, error: err.message };
        }
    }
}

const authService = new AuthService();
export default authService;