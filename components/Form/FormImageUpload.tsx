import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import FormItem from './FormItem';
import FormButton from './FormButton';
import { useAppDispatch } from 'utils/store';
import { updateData } from 'reducers/formSlice';
import Compressor from 'compressorjs';
import Cropper from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const CropperWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: ${({ theme }) => `1px solid ${theme.colors.purple}`};
  border-radius: 0 0 10px 10px;
  text-align: center;
  width: 40vw;
  & img {
    width: 100vw;
  }
  @media (max-width: 767px) {
    width: 100%;
  }
`;

interface FormImageUpload {
  name: string;
  src?: string;
}

const FormImageUpload: React.FC<FormImageUpload> = ({ name, src }) => {
  const [imageURL, setImageURL] = useState<string>(src);
  const [crop, setCrop] = useState<Cropper.Crop>({});
  const fileInputRef = useRef<HTMLInputElement>();
  const cropperRef = useRef<HTMLDivElement>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (src) setImageURL(src);
  }, []);

  useEffect(() => {
    if (imageURL === src) return;
    const image: HTMLImageElement = document.querySelector('.ReactCrop__image');
    if (!image) return;
    image.src = imageURL;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const regexp = new RegExp(
      /^(data:)([\w\/\+-]*)(;charset=[\w-]+|;base64){0,1},(.*)/gi
    );

    dispatch(
      updateData({
        field: name,
        value: regexp.exec(canvas.toDataURL('image/jpeg'))[4],
      })
    );
  }, [imageURL, crop]);

  const handleFileChange = async (file: Blob = null) => {
    if (!file?.type?.match('image/')) {
      setImageURL(undefined);
      return dispatch(
        updateData({
          field: name,
          value: null,
        })
      );
    }

    new Compressor(file, {
      quality: 0.8,
      maxHeight: 1080,
      maxWidth: 1920,
      success: (file: Blob) => {
        setCrop({
          aspect: 16 / 9,
          unit: '%',
          height: 100,
        });
        setImageURL(URL.createObjectURL(file));
      },
    });
  };

  return (
    <FormItem name={name}>
      <input
        type={'file'}
        ref={fileInputRef}
        accept={'image/*'}
        onChange={(e) => handleFileChange(e.target.files[0])}
        style={{ height: 0, visibility: 'hidden' }}
      />
      {imageURL ? (
        <CropperWrapper ref={cropperRef}>
          <Cropper
            src={imageURL}
            crop={crop}
            minHeight={140}
            onChange={(newCrop) => {
              imageURL !== src && newCrop.width !== 0 && setCrop(newCrop);
            }}
          />
          <FormButton onClick={() => fileInputRef.current.click()}>
            Change image
          </FormButton>
          <FormButton color={'red'} onClick={() => handleFileChange()}>
            Remove image
          </FormButton>
        </CropperWrapper>
      ) : (
        <FormButton onClick={() => fileInputRef.current.click()}>
          Add image
        </FormButton>
      )}
    </FormItem>
  );
};

export default FormImageUpload;
