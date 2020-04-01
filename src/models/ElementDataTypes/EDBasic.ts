// import { ElementData } from '..'
// /**
//   |--------------------------------------------------
//   | Basic types
//   | => Stored as is
//   | => Only requires validation and de/serialization
//   |--------------------------------------------------
// */
// export class EDString extends ElementData {
//   readonly type: 'EDString' = 'EDString'
//   constructor(data: EDString) {
//     super(data)
//   }
// }

// // Stored as string 😬
// export class EDNumber extends ElementData {
//   readonly type: 'EDNumber' = 'EDNumber'
//   constructor(data: EDString) {
//     super(data)
//   }
// }

// // Stored as 'true' | 'false' string
// export class EDBoolean extends ElementData {
//   readonly type: 'EDBoolean' = 'EDBoolean'
//   constructor(data: EDBoolean) {
//     super(data)
//   }
// }
