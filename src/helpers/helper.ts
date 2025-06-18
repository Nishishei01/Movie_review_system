
export const UtilsHelpers = {
  convertFieldList: (docs?: unknown) => {
    
    if (docs && Array.isArray(docs) && docs.length > 0) {
      for (const doc in docs) {
        UtilsHelpers.convertFields(docs[doc])
      }
    }
  },
  convertFields: (doc: Record<string, unknown>) => {
    // console.log(Object.keys(doc))
    
    Object.keys(doc).forEach((key) => {
      const value = doc[key]
      // console.log(value);
      
      if (typeof value === 'object' && value !== null) {
        if ('$oid' in value) {
          // console.log(value.$oid);
          
          const newKey = key === '_id' ? 'id' : key
          
          if (newKey !== key) {
            delete doc[key]
          }
          doc[newKey] = value.$oid
        } else if ('$date' in value) {
          // console.log(value.$date);
          
          doc[key] = value.$date
        } else {
          UtilsHelpers.convertFields(value as Record<string, unknown>)
        }
      }
    })
  },
}