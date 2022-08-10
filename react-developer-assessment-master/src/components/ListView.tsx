import { Button, DatePicker, Form, Input,Modal, Avatar, List, Skeleton  } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import locale from 'antd/es/date-picker/locale/vi_VN';
import moment from 'moment';
import Detail from './Detail';

interface DataType {
  id?: string;
  title?: string;
  publishDate?: string;
  author?: {
    name?: string;
    avatar?: string;
  };
  summary?: string;
  categories?: [
    {
      id?: string;
      name?: string;
    },
  ];
}

const ListView = () => {
  const [form] = Form.useForm();
  const [initLoading, setInitLoading] = useState(true);
  const loading = useState(false);
  const [list, setList] = useState<DataType[]>([]);
  const [count, setCount] = useState(3);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [valueUpdate, setValueUpdate] = useState<DataType[]>([]);

  const defaultValue = {
    txtDate: moment(new Date()),
    txtTitle: '',
  };
  const resetForm = () => {
    form.resetFields();
    if (count !== 3) {
      setCount(3);
    } else {
      fetch('/api/posts/', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setInitLoading(false);
          setList([...res.posts].slice(0, count));
        });
    }
  };

  const onLoadMore = () => {
    const loadMore = count + 3;
    setCount(loadMore);
  };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

  const filterData = () => {
    const valueForm = form.getFieldsValue();
    fetch('/api/posts/', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setList(
          [...res.posts]
            .filter((item) =>
              (item.title === valueForm.txtTitle) === undefined
                ? ''
                : valueForm.txtTitle || moment(item.item) === moment(valueForm.txtDate),
            )
            .slice(0, count),
        );
      });
  };

  const seeDetail = (id: string) => {
    setValueUpdate(list.filter((item) => item.id === id));
    setIsShowPopup(true);
  };

  const handleOk = () => {
    setIsShowPopup(false);
  };

  const handleCancel = () => {
    setIsShowPopup(false);
  };

  useEffect(() => {
    fetch('/api/posts/', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setList([...res.posts].slice(0, count));
      });
  }, []);
  useEffect(() => {
    fetch('/api/posts/', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setList([...res.posts].slice(0, count));
      });
  }, [count]);

  return (
    <Fragment>
      <Card>
        <CardBody>
          <Form layout={'vertical'} form={form} initialValues={defaultValue} colon={false}>
            <Row id="filterSection">
              <Col lg="6" md="6">
                <Form.Item
                  label="Title"
                  name="txtTitle"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  labelAlign="left"
                  colon={false}
                >
                  <Input
                    size="small"
                    placeholder="Title"
                    autoComplete="Off"
                    onBlur={() => filterData()}
                  />
                </Form.Item>
              </Col>
              <Col lg="6" md="6">
                <Form.Item
                  label="Type"
                  name="txtDate"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  labelAlign="left"
                  colon={false}
                >
                  <DatePicker
                    locale={locale}
                    format={'DD-MM-yyyy'}
                    size="small"
                    style={{ width: '100%' }}
                    className="ant-picker-small-custom"
                    onChange={() => filterData()}
                  />
                </Form.Item>
              </Col>
              <Col lg="24" md="24" className="text-center">
                <Form.Item>
                  <Button
                    htmlType="button"
                    className="btn btn-gradient-secondary"
                    color="gradient-secondary"
                    onClick={resetForm}
                  >
                    Reset
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col sm="24" md="24">
              <List
                className="demo-loadmore-list"
                loading={initLoading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={list}
                key="id"
                renderItem={(item) => (
                  <List.Item
                    actions={[[<Button onClick={() => seeDetail(item.id || "")}>Detail</Button>]]}
                  >
                    <Skeleton avatar title={false} active loading={initLoading}>
                      <List.Item.Meta
                        avatar={<Avatar src={item.author?.avatar} />}
                        title={item.author?.name}
                        description={item?.title}
                      />
                    </Skeleton>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </CardBody>
        <Modal title="Basic Modal" visible={isShowPopup} onOk={handleOk} onCancel={handleCancel}>
          <Detail prop={valueUpdate} />
        </Modal>
      </Card>
    </Fragment>
  );
};
export default ListView;
