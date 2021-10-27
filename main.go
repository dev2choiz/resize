package main

import (
	"bytes"
	"github.com/nfnt/resize"
	"image"
	"image/jpeg"
	_ "image/jpeg"
	_ "image/png"
	"syscall/js"
)

func main() {
	c := make(chan bool)
	js.Global().Set("wasmResize", resizeWrapper())
	<-c
}

// resizeWrapper return as js function to resize an image
func resizeWrapper() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 3 {
			return "Should pass 3 arguments"
		}
		jsFile := args[0]
		height := args[1].Int()
		width := args[2].Int()

		imgBytes := getBytesFromJsValue(jsFile)
		img, err := getImageFromByte(imgBytes)
		if err != nil {
			return err.Error()
		}
		resized := resizeImage(img, width, height)
		resizedJsValue, err := imageToJsValue(resized)
		if err != nil {
			return err.Error()
		}

		return resizedJsValue
	})
}

func getBytesFromJsValue(img js.Value) []byte {
	inBuf := make([]uint8, img.Get("byteLength").Int())
	js.CopyBytesToGo(inBuf, img)

	return inBuf
}

//getImageFromByte take []byte and return an image
func getImageFromByte(data []byte) (image.Image, error) {
	reader := bytes.NewReader(data)
	img, _, err := image.Decode(reader)

	return img, err
}

// resizeImage resize an image
func resizeImage(img image.Image, w, h int) image.Image {
	return resize.Resize(uint(w), uint(h), img, resize.Lanczos3)
}

// imageToJsValue turn an image to a js value
func imageToJsValue(img image.Image) (*js.Value, error) {
	buf := new(bytes.Buffer)
	err := jpeg.Encode(buf, img, nil)
	if err != nil {
		return nil, err
	}

	imgBytes := buf.Bytes()
	ret := js.Global().Get("Uint8Array").New(len(imgBytes))
	js.CopyBytesToJS(ret, imgBytes)
	return &ret, nil
}
