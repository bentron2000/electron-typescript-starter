// import * as React from 'react'
// import styled from 'styled-components'

// import { Text } from '../shared'
// import { theme } from '../shared/Theme/theme'

// import { Formik, FormikActions, FormikProps, Form } from 'formik'
// import * as Yup from 'yup'
// import { RenderBlockProps } from 'slate-react'

// const FieldContainer = styled.div`
//   display: inline-block;
//   position: relative;
//   border-radius: 20px;
//   border: 1px solid ${theme.grayLighter};
//   text-align: center;
//   color: ${theme.grayLighter};
//   margin-right: ${theme.s2};
//   margin-bottom: ${theme.s2};
//   padding: ${theme.s1} ${theme.s3};
//   cursor: pointer;
//   user-select: none;

//   :hover {
//     filter: brightness(1.2);
//   }
// `

// /**
//  * --------------------------------------------------
//  * A Simple String Field Based on Formik and Yup
//  * This is an ugly minimally functional POC for
//  * Testing embedded content in slate.
//  * --------------------------------------------------
//  */

// interface StringFieldValues {
//   value: string
// }

// interface StringFieldProps {
//   placeHolder?: string
//   label: string
//   value?: string
//   validationSchema?: Yup.ObjectSchema
// }

// // Example YUP validation schema

// const validationSchema = Yup.object().shape({
//   value: Yup.string().required(
//     'omg - you need to, like, put some text in bro.'
//   ),
// })

// // The nice thing about Yup is that it covers 90% of our validation needs
// // and it fits hand-in-glove with formik.
// // This will make it trivial to add admin controlled validation in the right hand
// // panels. We can compose yup validations and save them in the field definitions.

// export const StringField = ({
//   // validationSchema, // uncomment this to activate taking this value from props instead
//   value,
//   label,
//   attributes,
// }: StringFieldProps & RenderBlockProps) => {
//   // Some trickery might be required for submit on blur...
//   // otherwise, call this with a button or something...
//   const handleSubmit = (
//     values: StringFieldValues,
//     actions: FormikActions<StringFieldValues>
//   ) => {
//     console.log({ values, actions })
//     alert(JSON.stringify(values, null, 2))
//     actions.setSubmitting(false)
//   }

//   return (
//     <FieldContainer {...attributes}>
//       <Formik
//         initialValues={{ value }}
//         onSubmit={handleSubmit}
//         validationSchema={validationSchema}
//         render={({
//           values,
//           errors,
//           handleChange,
//           handleBlur,
//           touched,
//         }: FormikProps<StringFieldValues>) => {
//           const myBlur = (event: React.FocusEvent) => {
//             // POC intercept blur
//             handleBlur(event)
//             console.log('blur')
//           }
//           return (
//             <Form>
//               <Text body bold display='inline' color='inherit'>
//                 {label}:&nbsp;
//               </Text>
//               <input
//                 type='text'
//                 name='value'
//                 onChange={handleChange}
//                 onBlur={myBlur}
//                 value={values.value}
//                 // @ts-ignore
//                 onClick={(e: Event) => e.stopPropagation()} // required for field to capture focus
//               />
//               {errors.value && touched.value && <div>{errors.value}</div>}
//             </Form>
//           )
//         }}
//       />
//     </FieldContainer>
//   )
// }
