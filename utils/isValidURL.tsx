export default function isValidHttpUrl(string: string) {
    try {
        return (
            string.match(
                /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)/g
            ) !== null
        );
    } catch (e) {
        return false;
    }
}