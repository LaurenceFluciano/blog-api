
enum MaxTimePerUnit {
    s = 3600,
    m = 60,    
    h = 24,    
    d = 30     
}

export function isValidRefreshExpireIn(value: any): value is string {
    if (typeof value !== 'string') return false;

    const match = value.match(/^(\d+)([hd])?$/);
    if (!match) return false;

    const amount = parseInt(match[1], 10);
    const unit = (match[2] as keyof typeof MaxTimePerUnit) || 's';
    const limit = MaxTimePerUnit[unit];

    return amount <= limit;
}

export function isValidAccesExpireIn(value: any): value is string {
    if (typeof value !== 'string') return false;
    const match = value.match(/^(\d+)([sm])$/)
    if(!match) return false

    const amount = parseInt(match[1], 10);
    const unit = (match[2] as keyof typeof MaxTimePerUnit) || 's';
    const limit = MaxTimePerUnit[unit];

    return amount <= limit;

}