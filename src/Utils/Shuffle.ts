import randomInt from './Random.js'

export default function shuffle(array: Array<any>) {
    for (let i: number = array.length - 1; i > 0; i += -1) {
        const j: number = randomInt(0, i);
        [array[i], array[j]] = [array[j], array[i]]
    }
}
