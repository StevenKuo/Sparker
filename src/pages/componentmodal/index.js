import React, { useState } from 'react';
import get from 'lodash/get';
import { v4 as uuidv4 } from 'uuid';
import { Menu, Dropdown, Button, Modal, Input, Form, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, PhoneFilled } from '@ant-design/icons';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, updateMetadata } from "firebase/storage";
import {DropzoneDialog} from 'material-ui-dropzone';
const { TextArea } = Input;
import fb from '../../assets/fb.png';
import ig from '../../assets/ig.png';
import './index.scss';

function ComponentModal({onClose, onSubmit, componentKey, config, title}) {
  const [uploadImage, setUploadImage] = useState(false);
  const [uploadPDF, setUploadPDF] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadImageIndex, setUploadImageIndex] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [imageURLs, setImageURLs] = useState({});
  const [pdfURL, setPDFURL] = useState(null);
  const firebaseConfig = {
    apiKey: "AIzaSyDQaJF2dpXf2k6YzS1UXSUGg0r5V-Gvr3g",
    authDomain: "sparker-265f5.firebaseapp.com",
    projectId: "sparker-265f5",
    storageBucket: "sparker-265f5.appspot.com",
    messagingSenderId: "636447858999",
    appId: "1:636447858999:web:683d7fed592c8291483ab2",
    measurementId: "G-B367B2N07X"
  };
  const firebaseApp = initializeApp(firebaseConfig);
  const storage = getStorage(firebaseApp);

  const { t } = useTranslation();

  const uploadPDFToStorage = (file) => {
    const hide = message.loading(t('uploading'), 0);
    const storageRef = ref(storage, `pdf/${uuidv4()}.pdf`);
    uploadBytes(storageRef, file).then((snapshot) => {
      const fullpath = snapshot.fullpath
      const newMetadata = {
        cacheControl: 'public, max-age=604800, immutable',
        contentType: 'application/pdf'
      };
      updateMetadata(storageRef, newMetadata)
      .then((metadata) => {
        getDownloadURL(storageRef)
        .then(url => {
          setPDFURL(url)
          hide()
          setImageUploading(false)
        })
      })
    });
  }

  const uploadImageToStorage = (file) => {
    const hide = message.loading(t('uploading'), 0);
    const storageRef = ref(storage, `images/${uuidv4()}.jpg`);
    uploadBytes(storageRef, file).then((snapshot) => {
      const fullpath = snapshot.fullpath
      const newMetadata = {
        cacheControl: 'public, max-age=604800, immutable',
        contentType: 'image/jpeg'
      };
      updateMetadata(storageRef, newMetadata)
      .then((metadata) => {
        getDownloadURL(storageRef)
        .then(url => {
          if (uploadImageIndex !== null) {
            setImageURLs({...imageURLs, [`${uploadImageIndex}`]: url})
          } else {
            setImageURL(url)
          }
          hide()
          setImageUploading(false)
        })
      })
    });
  }

  const actionTitle = () => (
    config === undefined ? t('create') : t('update')
  )

  return (
    <div>
      <DropzoneDialog
          open={uploadImage || uploadImageIndex !== null}
          onSave={(files) => {
            setUploadImage(false)
            setUploadImageIndex(null)
            setImageUploading(true)
            uploadImageToStorage(files[0])
          }}
          acceptedFiles={['.jpg', '.jpeg']}
          showPreviews={true}
          maxFileSize={5000000}
          onClose={() => {
            setUploadImage(false)
            setUploadImageIndex(null)
          }}
      />
      <DropzoneDialog
          open={uploadPDF}
          onSave={(files) => {
            setUploadPDF(false)
            setImageUploading(true)
            uploadPDFToStorage(files[0])
          }}
          acceptedFiles={['.pdf']}
          showPreviews={true}
          maxFileSize={5000000}
          onClose={() => {
            setUploadPDF(false)
          }}
      />
      <Modal
        className="component-modal"
        title={title}
        visible
        onCancel={onClose}
        footer={null}
      >
        {
          componentKey === 'banner' &&
          <Form name="create-banner" initialValues={config} onFinish={(values) => onSubmit({imageURL})}>
            <Form.Item>
              {
                (imageURL !== null || get(config, 'imageURL', null) !== null)
                ?
                <img className="item-picture" src={imageURL !== null ? imageURL : get(config, 'imageURL', null)} />
                :
                <Button disabled={imageUploading} onClick={() => setUploadImage(true)}>{t('upload_image')}</Button>
              }
            </Form.Item>
            <Form.Item className="submit-footer">
              <Button htmlType="submit" size="large" type="primary">{actionTitle()}</Button>
            </Form.Item>
          </Form>
        }
        {
          componentKey === 'youtube' &&
          <Form name="create-youtube" initialValues={config} onFinish={(values) => onSubmit({...values})}>
            <Form.Item label="YouTube Video ID" name="videoId" rules={[{ required: true, message: 'Please input YouTube video ID' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="desc">
              <Input size="large"/>
            </Form.Item>
            <Form.Item className="submit-footer">
              <Button htmlType="submit" size="large" type="primary">{actionTitle()}</Button>
            </Form.Item>
          </Form>
        }
        {
          (componentKey === 'carousel' || componentKey === 'grid') &&
          <Form name="create-carousel" initialValues={config} onFinish={(values) => {
            const withImage = values.detail.flatMap((value, index) => {
              if (imageURLs[index] !== undefined) {
                return {
                  ...value,
                  imageURL: imageURLs[index]
                }
              }
                return value
            })
            onSubmit({...values, detail: withImage})
          }}>
            <Form.Item label="Section Title" name="sectionTitle">
              <Input/>
            </Form.Item>
            <Form.List name="detail">
             {(fields, { add, remove }) => (
               <div>
                {
                  fields.map(({key, name, ...restField}) => {
                    const configImageURLs = get(config, 'detail', []).flatMap(item => item.imageURL)
                    return (
                      <div className='caousel-item'>
                        <Form.Item label='Title' {...restField} name={[name, 'title']}>
                          <Input />
                        </Form.Item>
                        <Form.Item label='Description' {...restField} name={[name, 'description']}>
                          <Input />
                        </Form.Item>
                        {
                          (get(imageURLs, `${key}`, undefined) !== undefined || configImageURLs[key] !== undefined)
                          ?
                          <img className="item-picture" src={get(imageURLs, `${key}`, undefined) !== undefined ? get(imageURLs, `${key}`, undefined) : configImageURLs[key]} />
                          :
                          <Button onClick={() => setUploadImageIndex(key)}>Upload Image</Button>
                        }
                      </div>
                    )
                  })
                }
                <Form.Item>
                  <Button disabled={fields.length == 6} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>{`Add item (remaining ${6 - fields.length})`}</Button>
                </Form.Item>
                <Form.Item className="submit-footer">
                  <Button htmlType="submit" size="large" type="primary">{actionTitle()}</Button>
                </Form.Item>
               </div>
             )}
            </Form.List>
          </Form>
        }
        {
          componentKey === 'article' &&
          <Form name="create-article" initialValues={config} onFinish={(values) => onSubmit({...values})}>
            <Form.Item name="article">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item className="submit-footer">
              <Button htmlType="submit" size="large" type="primary">{actionTitle()}</Button>
            </Form.Item>
          </Form>
        }
        {
          componentKey === 'contact' &&
          <div className='contact-container'>
            <div>
              <img src={fb} />
              <img src={ig} />
              <PhoneFilled />
            </div>
            <div>
              <Form name="create-contact" initialValues={config} onFinish={(values) => onSubmit({...values})}>
                <Form.Item className='social-input' name="fb">
                  <Input placeholder="Facebook URL" />
                </Form.Item>
                <Form.Item className='social-input' name="ig">
                  <Input placeholder="Instagram URL" />
                </Form.Item>
                <Form.Item className='social-input' name="phone">
                  <Input placeholder="Phone number" />
                </Form.Item>
                <Form.Item className='social-input' name="text">
                  <TextArea placeholder="Additional Information" rows={4} />
                </Form.Item>
                <Form.Item className="submit-footer">
                  <Button htmlType="submit" size="large" type="primary">{actionTitle()}</Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        }
        {
          componentKey === 'pdf' &&
          <Form name="create-pdf" initialValues={config} onFinish={(values) => {
            if (pdfURL !== null) {
              onSubmit({...values, url: pdfURL})
            } else {
              onSubmit(values)
            }
          }}>
            <Form.Item label="File Title" name="title">
              <Input size="large"/>
            </Form.Item>
            <Form.Item label="White List" name="emailList">
              <Input size="large" placeholder='ex: abc@gmail.com,def@hotmail.com'/>
            </Form.Item>
            {
              (pdfURL !== null || get(config, 'url', null) !== null)
              ?
              <Form.Item name="url">
                <Input size="large"  defaultValue={pdfURL !== null ? pdfURL : get(config, 'url', null)} disabled/>
              </Form.Item>
              :
              <Form.Item>
                <Button disabled={imageUploading} onClick={() => setUploadPDF(true)}>{t('upload_pdf')}</Button>
              </Form.Item>
            }
            <Form.Item className="submit-footer">
              <Button htmlType="submit" size="large" type="primary">{actionTitle()}</Button>
            </Form.Item>
          </Form>
        }
      </Modal>
    </div>
  )
}

export default ComponentModal;
