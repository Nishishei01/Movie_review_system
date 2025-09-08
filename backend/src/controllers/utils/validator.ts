
export const Validator = {
  isTimeStampISOString: (date: string) => {
    if (date) {
      const reg = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
      return reg.test(date)
    }
    return false
  }
}