import React, { useState } from 'react';
import { Button, Modal, Input, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import LoadingButton from '../../components/loadingbutton';

function AppModal({onClose, onCreate}) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  return (
    <Modal
      title={t('create_new_app')}
      visible
      onCancel={onClose}
      footer={null}
    >
      <Form name="create-app" onFinish={(values) => onCreate(values.app_name)}>
        <Form.Item name="app_name" rules={[{ required: true, message: t('app_name_required') }]}>
          <Input size="large" placeholder={t('app_name')} />
        </Form.Item>
        <Form.Item className="submit-footer">
          <LoadingButton
          loading={loading}
          renderButton={() => <Button htmlType="submit" size="large" type="primary">{t('create')}</Button>} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AppModal;
