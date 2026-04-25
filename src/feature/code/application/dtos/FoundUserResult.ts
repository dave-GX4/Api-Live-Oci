export default interface FoundUserResult {
    id: string;
    name: string;
    avatarUrl?: string;
    code: string;
    requestId?: string;
    requestStatus?: 'pending' | 'rejected' | 'accepted';
    isRequester?: boolean;    // true = yo la envié, false = me la enviaron a mí
}