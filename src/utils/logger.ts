import chalk from 'chalk';

class Logger {
    private static getTimeStamp(): string {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear()).slice(-2);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    }

    public static log(...messages: any[]): void {
        console.log(chalk.blue(`[INFO] [${this.getTimeStamp()}]:`), ...messages);
    }

    public static error(...messages: any[]): void {
        console.error(chalk.red(`[ERROR] [${this.getTimeStamp()}]:`), ...messages);
    }

    public static warning(...messages: any[]): void {
        console.warn(chalk.yellow(`[WARNING] [${this.getTimeStamp()}]:`), ...messages);
    }
}

export default Logger;