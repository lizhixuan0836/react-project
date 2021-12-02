import React from "react";
import useForm from "./useForm";
import FieldContext from "./FieldContext";

// 2、通过Provider进行值的传递
export default function Form({children, form, onFinish, onFinishFailed}, ref) {
  const [formInstance] = useForm(form);
  // useImperativeHandle可以通过使用ref时自定义暴露给父组件的实列值，并配合forwardRef一起使用
  React.useImperativeHandle(ref, () => formInstance);

  formInstance.setCallbacks({
    onFinish,
    onFinishFailed,
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        formInstance.submit();
      }}>
      <FieldContext.Provider value={formInstance}>
        {children}
      </FieldContext.Provider>
    </form>
  );
}
