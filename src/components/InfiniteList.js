import { Image, Modal } from 'antd';
import { Virtuoso } from 'react-virtuoso';
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function ImageList({ images }) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = (image) => {
    setPreviewImage(image);
    setPreviewVisible(true);
  };

  const handleCancel = () => setPreviewVisible(false);

  return (
 
      <Virtuoso
         totalCount={images.length}
        itemContent={(index) => (
        
          <div style={{ padding: '0.5em', width: '33%', boxSizing: 'border-box' }}>
            <Image
              style={{ width: '100%', height: 200 }}
                src={images[index].blog_image}
                onClick={() => handlePreview(images[index].blog_image)}
              />
          </div>
        
        )}
      />
  
  );
}

export default ImageList;
