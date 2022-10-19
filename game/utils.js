
class Utils {

    static compare(a, b) {
        if (a.length != b.length) return false;
        for (let x = 0; x < a.length; x++) {
            if (a[x] != b[x]) return false;
        }
        return true;
    }

}