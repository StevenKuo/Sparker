import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Dropdown, Button, Row, Col, message} from 'antd';
import isEmpty from 'lodash/isEmpty';
import ComponentModal from '../componentmodal';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import {
  PictureFilled,
  YoutubeFilled,
  ProfileFilled,
  AppstoreFilled,
  ReadFilled,
  PhoneFilled,
  DeleteFilled,
  EditFilled,
  FilePdfFilled
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import './index.scss';

function AppLayout({app, onPublish}) {
  const [newComponent, setNewComponent] = useState(null);
  const [editComponent, setEditComponent] = useState(null);
  const [localLayout, setLocalLayout] = useState(null);
  const {t} = useTranslation();

  useEffect(() => {
    setLocalLayout(get(app, 'layout', null))
  }, [app]);

  const addLayout = (values) => {
    let update = cloneDeep(localLayout)
    update.push({...values, key: newComponent})
    setLocalLayout(update)
  }

  const updateLayout = (values, index) => {
    let update = cloneDeep(localLayout)
    update[index] = {...values, key: editComponent.layout.key}
    setLocalLayout(update)
  }

  const deleteLayout = (index) => {
    let update = Array.from(cloneDeep(localLayout))
    update.splice(index, 1)
    setLocalLayout(update)
  }

  const reorder = (result) => {
    let update = Array.from(cloneDeep(localLayout))
    const [reorderItem] = update.splice(result.source.index, 1)
    update.splice(result.destination.index, 0, reorderItem)
    setLocalLayout(update)
  }

  return (
    <div className='applayout-view'>
      {
        newComponent !== null &&
        <ComponentModal
        componentKey={newComponent}
        title={t(`${newComponent}_create`)}
        onClose={() => setNewComponent(null)}
        onSubmit={(values) => {
          addLayout(values)
          setNewComponent(null)
        }}/>
      }
      {
        editComponent !== null &&
        <ComponentModal
        componentKey={editComponent.layout.key}
        title={t(`${editComponent.layout.key}_update`)}
        config={editComponent.layout}
        onClose={() => setEditComponent(null)}
        onSubmit={(values) => {
          updateLayout(values, editComponent.index)
          setEditComponent(null)
        }}/>
      }
      {
        localLayout === null
        ?
        null
        :
        <div className='applayout-container'>
          <div>
            <DragDropContext onDragEnd={reorder}>
              <Droppable direction="vertical" droppableId="applayout">
                {(provided) => (
                  <div ref={provided.innerRef}>
                    <div className="layout-navigation">{app.name}</div>
                    {
                      localLayout.map((layout, index) => (
                        <Draggable key={layout.key} draggableId={layout.key} index={index}>
                          {(provided) => (
                            <div className="layout-component" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <div>{t(layout.key)}</div>
                              <Button onClick={() => deleteLayout(index)} type='primary' icon={<DeleteFilled />}></Button>
                              <Button onClick={() => setEditComponent({layout, index})} type='primary' icon={<EditFilled />}></Button>
                            </div>
                          )}
                        </Draggable>
                      ))
                    }
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div>
            <Row>
              <Col span={12} onClick={() => setNewComponent('banner')}>
                <div>
                  <div>
                    <PictureFilled />
                    <span>{t('banner')}</span>
                  </div>
                </div>
              </Col>
              <Col span={12} onClick={() => setNewComponent('youtube')}>
                <div>
                  <div>
                    <YoutubeFilled />
                    <span>{t('youtube')}</span>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12} onClick={() => {
                const limit = localLayout.flatMap(layout => layout.key).includes('carousel')
                if (limit === false) {
                  setNewComponent('carousel')
                } else {
                  message.warning('超過使用此數');
                }
              }}>
                <div>
                  <div>
                    <div>
                      <ProfileFilled />
                      <ProfileFilled />
                    </div>
                    <span>{t('carousel')}</span>
                  </div>
                </div>
              </Col>
              <Col span={12} onClick={() => {
                const limit = localLayout.flatMap(layout => layout.key).includes('grid')
                if (limit === false) {
                  setNewComponent('grid')
                } else {
                  message.warning('超過使用此數');
                }
              }}>
                <div>
                  <div>
                    <AppstoreFilled />
                    <span>{t('grid')}</span>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12} onClick={() => setNewComponent('article')}>
                <div>
                  <div>
                    <ReadFilled />
                    <span>{t('article')}</span>
                  </div>
                </div>
              </Col>
              <Col span={12} onClick={() => setNewComponent('contact')}>
                <div>
                  <div>
                    <PhoneFilled />
                    <span>{t('contact')}</span>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12} onClick={() => {
                const limit = localLayout.flatMap(layout => layout.key).includes('pdf')
                if (limit === false) {
                  setNewComponent('pdf')
                } else {
                  message.warning('超過使用此數');
                }
              }}>
                <div>
                  <div>
                    <FilePdfFilled />
                    <span>PDF</span>
                  </div>
                </div>
              </Col>
            </Row>
            <Button disabled={isEqual(localLayout, app.layout)} type="primary" onClick={() => onPublish(localLayout)}>{t('publish')}</Button>
          </div>
        </div>
      }
    </div>
  )
}

export default AppLayout;
