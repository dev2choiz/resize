// Typing

/**
 * @function wasmResize
 * @param {Uint8Array} data
 * @param {number} width
 * @param {number} height
 *
 * @return {Promise<Uint8Array|string>} return a Uint8Array or string error
 */

if (!WebAssembly.instantiateStreaming) { // polyfill
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer()
        return await WebAssembly.instantiate(source, importObject)
    }
}

/** @type HTMLDivElement **/
const elmMessage = document.getElementById("message")
/** @type HTMLImageElement **/
const elmImg1 = document.getElementById('img1')
/** @type HTMLDivElement **/
const elmSizeImg1 = document.getElementById('sizeImg1')
/** @type HTMLImageElement **/
const elmImg2 = document.getElementById('img2')
/** @type HTMLDivElement **/
const elmSizeImg2 = document.getElementById('sizeImg2')


const go = new Go()
let mainMod, mainInst

/**
 * Init go webassembly
 * @returns {Promise<void>}
 */
async function initMainWasm() {
    try {
        const result = await WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject)
        mainMod = result.module
        mainInst = result.instance
        await go.run(mainInst)
    } catch (err) {
        console.error(err)
    }
}

initMainWasm().then()

/**
 * @param {HTMLInputElement} el
 * @returns {Promise<void>}
 */
async function onFileChange(el) {
    elmMessage.innerHTML = ''
    if (0 === el.files.length) return
    const file = el.files[0]


    elmImg1.src = URL.createObjectURL(file)
    elmSizeImg1.innerHTML = `${file.size} bytes`

    const result = await resizeImage(file)
    if ('string' === typeof result) {
        elmMessage.innerHTML = result
        return
    }
    elmImg2.src = URL.createObjectURL(result)
    elmSizeImg2.innerHTML = `${result.size} bytes`
}

/**
 * Resize an image file
 * @param {File} file
 * @return {Promise<File|string>}
 */
async function resizeImage(file) {
    const arrayBuffer = await file.arrayBuffer()

    const bytes = new Uint8Array(arrayBuffer)

    const result = await wasmResize(bytes, 100, 100)
    if ('string' == typeof result) {
        return result
    }

    return new File([result.buffer], file.name)
}
