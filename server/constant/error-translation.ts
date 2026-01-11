
import { SetErrorFunction, DefaultErrorFunction, ValueErrorType } from '@sinclair/typebox/errors'

SetErrorFunction((error) => { // i18n override
  switch(error.errorType) {
    // th-TH translate to thai
    case ValueErrorType.Array: return `ต้องเป็นอาเรย์`
    case ValueErrorType.ArrayContains: return `ต้องมีค่าอย่างน้อยหนึ่งค่าที่ตรงกับเงื่อนไขที่กำหนด`
    case ValueErrorType.ArrayMaxContains: return `มีค่าที่ตรงกับเงื่อนไขที่กำหนดเกินกว่าค่าสูงสุดที่อนุญาต`
    case ValueErrorType.ArrayMaxItems: return `มีจำนวนสมาชิกเกินกว่าค่าสูงสุดที่อนุญาต`
    case ValueErrorType.ArrayMinContains: return `ไม่มีค่าที่ตรงกับเงื่อนไขที่กำหนดตามค่าต่ำสุดที่อนุญาต`
    case ValueErrorType.ArrayMinItems: return `มีจำนวนน้อยกว่าค่าต่ำสุดที่อนุญาต`
    case ValueErrorType.ArrayUniqueItems: return `สมาชิกในอาเรย์ต้องไม่ซ้ำกัน`
    case ValueErrorType.Boolean: return `ต้องเป็นค่าบูลีน (true หรือ false)`
    case ValueErrorType.AsyncIterator: return `ต้องเป็น Async Iterator`
    case ValueErrorType.Iterator: return `ต้องเป็น Iterator`
    case ValueErrorType.BigInt: return `ต้องเป็น BigInt`
    case ValueErrorType.BigIntExclusiveMaximum: return `ต้องน้อยกว่า (exclusive) ค่าสูงสุดที่กำหนด`
    case ValueErrorType.BigIntExclusiveMinimum: return `ต้องมากกว่า (exclusive) ค่าต่ำสุดที่กำหนด`
    case ValueErrorType.BigIntMaximum: return `ต้องน้อยกว่าหรือเท่ากับค่าสูงสุดที่กำหนด`
    case ValueErrorType.BigIntMinimum: return `ต้องมากกว่าหรือต่ำกว่าค่าต่ำสุดที่กำหนด`
    case ValueErrorType.BigIntMultipleOf: return `ต้องเป็นผลคูณของค่าที่กำหนด`
    case ValueErrorType.Date: return `ต้องเป็นวันที่ที่ถูกต้อง`
    case ValueErrorType.DateExclusiveMaximumTimestamp: return `ต้องน้อยกว่ (exclusive) ค่าสูงสุดของ timestamp ที่กำหนด`
    case ValueErrorType.DateExclusiveMinimumTimestamp: return `ต้องมากกว่า (exclusive) ค่าต่ำสุดของ timestamp ที่กำหนด`
    case ValueErrorType.DateMaximumTimestamp: return `ต้องน้อยกว่าหรือเท่ากับค่าสูงสุดของ timestamp ที่กำหนด`
    case ValueErrorType.DateMinimumTimestamp: return `ต้องมากกว่าหรือต่ำกว่าค่าต่ำสุดของ timestamp ที่กำหนด`
    case ValueErrorType.DateMultipleOfTimestamp: return `ต้องเป็นผลคูณของค่าของ timestamp ที่กำหนด`
    case ValueErrorType.Function: return `ต้องเป็นฟังก์ชัน`
    case ValueErrorType.Integer: return `ต้องเป็นจำนวนเต็ม`
    case ValueErrorType.IntegerExclusiveMaximum: return `ต้องน้อยกว่า (exclusive) ค่าสูงสุดที่กำหนด`
    case ValueErrorType.IntegerExclusiveMinimum: return `ต้องมากกว่า (exclusive) ค่าต่ำสุดที่กำหนด`
    case ValueErrorType.IntegerMaximum: return `ต้องน้อยกว่าหรือเท่ากับค่าสูงสุดที่กำหนด`
    case ValueErrorType.IntegerMinimum: return `ต้องมากกว่าหรือต่ำกว่าค่าต่ำสุดที่กำหนด`
    case ValueErrorType.IntegerMultipleOf: return `ต้องเป็นผลคูณของค่าที่กำหนด`
    case ValueErrorType.Kind: return `ชนิดของข้อมูลไม่ถูกต้อง`
    case ValueErrorType.Literal: return `ต้องตรงกับค่าคงที่ที่กำหนด`
    case ValueErrorType.Never: return `ไม่อนุญาตให้มีค่าใด ๆ`
    case ValueErrorType.Not: return `ค่าที่ระบุไม่เป็นไปตามเงื่อนไขที่ห้ามไว้`
    case ValueErrorType.Null: return `ต้องเป็นค่า null`
    case ValueErrorType.Number: return `ต้องเป็นตัวเลข`
    case ValueErrorType.NumberExclusiveMaximum: return `ต้องน้อยกว่า (exclusive) ค่าสูงสุดที่กำหนด`
    case ValueErrorType.NumberExclusiveMinimum: return `ต้องมากกว่า (exclusive) ค่าต่ำสุดที่กำหนด`
    case ValueErrorType.NumberMaximum: return `ต้องน้อยกว่าหรือเท่ากับค่าสูงสุดที่กำหนด`
    case ValueErrorType.NumberMinimum: return `ต้องมากกว่าหรือต่ำกว่าค่าต่ำสุดที่กำหนด`
    case ValueErrorType.NumberMultipleOf: return `ต้องเป็นผลคูณของค่าที่กำหนด`
    case ValueErrorType.Object: return `ต้องเป็นวัตถุ (object)`
    case ValueErrorType.ObjectAdditionalProperties: return `มีคุณสมบัติที่ไม่อนุญาตในวัตถุ`
    case ValueErrorType.ObjectMaxProperties: return `มีจำนวนคุณสมบัติเกินกว่าค่าสูงสุดที่อนุญาต`
    case ValueErrorType.ObjectMinProperties: return `มีจำนวนน้อยกว่าค่าต่ำสุดที่อนุญาต`
    case ValueErrorType.ObjectRequiredProperty: return `ขาดคุณสมบัติที่จำเป็น`
    case ValueErrorType.Promise: return `ต้องเป็น Promise`
    case ValueErrorType.RegExp: return `ต้องเป็นนิพจน์ปกติ (Regular Expression)`
    case ValueErrorType.String: return `ต้องเป็นสตริง`
    case ValueErrorType.StringFormatUnknown: return `รูปแบบสตริงไม่เป็นที่รู้จัก`
    case ValueErrorType.StringFormat: return `ต้องตรงกับรูปแบบที่กำหนด`
    case ValueErrorType.StringMaxLength: return `มีความยาวเกินกว่าค่าสูงสุดที่อนุญาต`
    case ValueErrorType.StringMinLength: return `มีความยาวน้อยกว่าค่าต่ำสุดที่อนุญาต`
    case ValueErrorType.StringPattern: return `ต้องตรงกับรูปแบบ (pattern) ที่กำหนด`
    case ValueErrorType.Symbol: return `ต้องเป็นสัญลักษณ์ (Symbol)`
    case ValueErrorType.TupleLength: return `ความยาวของทูเพิลไม่ถูกต้อง`
    case ValueErrorType.IntersectUnevaluatedProperties: return `มีคุณสมบัติที่ไม่ได้รับการประเมินในอินเตอร์เซคต์`
    case ValueErrorType.Intersect: return `ค่าที่ระบุไม่เป็นไปตามเงื่อนไขของอินเตอร์เซคต์`
    case ValueErrorType.Tuple: return `ต้องเป็นทูเพิล`
    case ValueErrorType.Uint8ArrayMaxByteLength: return `มีความยาวไบต์เกินกว่าค่าสูงสุดที่อนุญาต`
    case ValueErrorType.Uint8Array: return `ต้องเป็น Uint8Array`
    case ValueErrorType.Uint8ArrayMinByteLength: return `มีความยาวไบต์น้อยกว่าค่าต่ำสุดที่อนุญาต`
    case ValueErrorType.Undefined: return `ต้องเป็นค่า undefined`
    case ValueErrorType.Void: return `ต้องเป็นค่า void`
    case ValueErrorType.Union: return `ค่าที่ระบุไม่เป็นไปตามเงื่อนไขของยูเนียน`
    /* en-US */ default: return DefaultErrorFunction(error)
  }
})
