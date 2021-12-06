import React, {Component} from "react";
// import Form, {Field} from "rc-field-form";
import Form, {Field} from "../components/my-rc-field-form";
import Input from "../components/Input";

const nameRules = {required: true, message: "请输入姓名！"};
const passworRules = {required: true, message: "请输入密码！"};

// export default function RCFieldForm(props) {
//   const [form] = Form.useForm();

//   const onFinish = (val) => {
//     console.log("onFinish", val); //sy-log
//   };

//   // 表单校验失败执行
//   const onFinishFailed = (val) => {
//     console.log("onFinishFailed", val); //sy-log
//   };

//   useEffect(() => {
//     console.log("form", form); //sy-log
//     form.setFieldsValue({username: "default"});
//   }, []);

//   return (
//     <div>
//       <h3>RCFieldForm</h3>
//       <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
//         <Field name="username" rules={[nameRules]}>
//           <Input placeholder="input UR Username" />
//         </Field>
//         <Field name="password" rules={[passworRules]}>
//           <Input placeholder="input UR Password" />
//         </Field>
//         <button>Submit</button>
//       </Form>
//     </div>
//   );
// }

// antd3 form 存到了form state,基于 hoc
// antd4 form 存到了一个数据仓库 set  get，基于hook。对应的react版本号是react16.8+

export default class RCFieldForm extends Component {
  formRef = React.createRef();
  componentDidMount() {
    // console.log("form", this.formRef.current); //sy-log
    this.formRef.current.setFieldsValue({username: "default"});
  }

  onFinish = (val) => {
    console.log("onFinish", val); //sy-log
  };

  // 表单校验失败执行
  onFinishFailed = (val) => {
    console.log("onFinishFailed", val); //sy-log
  };
  render() {
    return (
      <div>
        <h3>RCFieldForm</h3>
        <Form
          ref={this.formRef}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}>
          <Field name="username" rules={[nameRules]}>
            <Input placeholder="Username" />
          </Field>
          <Field name="password" rules={[passworRules]}>
            <Input placeholder="Password" />
          </Field>
          <button>Submit</button>
        </Form>
      </div>
    );
  }
}
