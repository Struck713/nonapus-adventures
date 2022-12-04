
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

    static inBounds(x, y, x1, y1, width, height) {
        return x >= x1 && x <= (x1 + width) && y >= y1 && y <= (y1 + height)
    }

    static deepCopy(object) {
        let clone = Object.assign(Object.create(Object.getPrototypeOf(object)), object);
        return clone;
    }

    static randomInt(min, max) {
        return floor(random(min, max));
    }

}

class WaveUtils {

    // generates a list of points along a sine wave
    static pointsAlongWave(amount) {
        let stack = [];
        let inc = (2 * Math.PI) / amount;
        for (let x = 0; x < (2 * Math.PI); x += inc) stack.push(Math.sin(x));
        return stack;
    }

    static pointsAlongCircle(amount) {
        let stack = [];
        let inc = (2 * Math.PI) / amount;
        for (let i = 0; i < (2 * Math.PI); i += inc) {
            let x = Math.cos(i);
            let y = Math.sin(i);
            stack.push({ x, y });
        }
        return stack;
    }

    static POINTS_25 = WaveUtils.pointsAlongWave(25);
    static CIRCLE_12 = WaveUtils.pointsAlongCircle(12);

}