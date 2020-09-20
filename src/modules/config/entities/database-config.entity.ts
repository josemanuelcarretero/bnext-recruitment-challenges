export interface DatabaseConfig {
    readonly type: string;
    readonly host: string;
    readonly port: string;
    readonly username: string;
    readonly password: string;
    readonly database: string;
}
