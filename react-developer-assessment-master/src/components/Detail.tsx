import { Form, Input } from 'antd';
import moment from 'moment';
import { Fragment, useEffect } from 'react';
import { Col, Label } from 'reactstrap';
import locale from 'antd/es/date-picker/locale/vi_VN';

interface DataProps {
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

const Detail = (prop: any) => {
  const [form] = Form.useForm();
  const valueBind = prop;
  console.log(prop)

  useEffect(() => {
    console.log(valueBind.prop[0]);
    form.setFieldsValue({
      txtDate: moment(valueBind.prop[0].publishDate),
    });
    form.setFieldsValue({
      txtSumary: valueBind.prop[0].summary,
    });
  }, []);

  return (
    <Fragment>
      <Form layout={'vertical'} form={form}>
        <Col md="24" lg="24">
          <Form.Item name="txtDate" label="publishDate">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col md="24" lg="24">
          <Form.Item name="txtSumary" label="summary">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col md="24" lg="24">
          <Form.Item name="txtSumary" label="categories">
            {valueBind.prop[0].categories?.map((item: any) => {
              return <div>{item.name}</div>;
            })}
          </Form.Item>
        </Col>
      </Form>
    </Fragment>
  );
};
export default Detail;
