
class Utils {

    // compares two arrays
    static compare(a, b) {
        if (a.length != b.length) return false;
        for (let x = 0; x < a.length; x++) {
            if (a[x] != b[x]) return false;
        }
        return true;
    }

    // removes an item from an array
    static remove(array, item) {
        let index = array.indexOf(item);
        if (index > - 1) array.splice(index, 1);
    }

}

class WaveUtils {

    // generates a list of points along a sine wave
    static pointsAlongWave(amount) {
        let stack = [];
        var inc = (2 * Math.PI) / amount;
        for (var x = 0; x < (2 * Math.PI); x += inc) stack.push(Math.sin(x));
        return stack;
    }
    
    static POINTS_25 = WaveUtils.pointsAlongWave(25);

}