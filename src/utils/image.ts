function compressImage(file: File, quality: number = 0.7, maxWidth: number = 800): Promise<File> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = height * (maxWidth / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            ctx?.drawImage(img, 0, 0, width, height);

            canvas.toBlob(blob => {
                if (blob) {
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(compressedFile);
                } else {
                    reject(new Error('压缩图像时发生错误'));
                }
            }, 'image/jpeg', quality);
        };

        img.onerror = error => reject(error);
    });
}

export { compressImage };
