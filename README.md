# Tipos comuns

# no build apagar os dist ....

# trpc query e form data para fotos ficheiros

import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '../utils/trpc';
import { useState } from 'react';

export default function FileUpload() {
const trpc = useTRPC();
const [selectedFile, setSelectedFile] = useState<File | null>(null);

// Option 1: Upload file using FormData with tRPC
const fileUploadMutation = useMutation(
trpc.uploadFile.mutationOptions()
);

const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
const file = event.target.files?.[0];
if (file) {
setSelectedFile(file);
}
};

const handleUpload = async () => {
if (!selectedFile) return;

    // Create FormData object - much better for large files
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('fileName', selectedFile.name);
    formData.append('fileType', selectedFile.type);
    formData.append('fileSize', selectedFile.size.toString());

    // tRPC can handle FormData directly
    fileUploadMutation.mutate(formData);

};

return (

<div>
<input 
        type="file" 
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx"
      />

      {selectedFile && (
        <div>
          <p>Selected: {selectedFile.name}</p>
          <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>

          <button
            onClick={handleUpload}
            disabled={fileUploadMutation.isPending}
          >
            {fileUploadMutation.isPending ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      )}

      {fileUploadMutation.isError && (
        <p style={{ color: 'red' }}>
          Error: {fileUploadMutation.error?.message}
        </p>
      )}

      {fileUploadMutation.isSuccess && (
        <p style={{ color: 'green' }}>
          File uploaded successfully!
        </p>
      )}
    </div>

);
}

/\*

foto

          <div onDragOver={handleDragOver} onDrop={handleDrop}>
            <input
              type="file"
              onChange={(event) =>
                event.target.files === null || escreveImagem(event.target.files)
              }
              hidden
              accept="image/png, image/jpeg"
              ref={inputRef}
            />

            <Image
              src={
                modelo.imagemTemp
                  ? URL.createObjectURL(modelo.imagemTemp)
                  : foto
              }
              alt="Foto"
              width="200"
              height="200"
              className="pe-1"
              onClick={() => {
                console.log("Cliquei na imagem....");
                inputRef.current?.click();
              }}
            />
          </div>

\*/
