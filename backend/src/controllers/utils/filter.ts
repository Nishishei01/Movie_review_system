import { Validator } from "./validator"

export type Query = {
  rowsPerPage?: number
  page?: number,
  startCreate?: string,
  endCreate?: string,
  startUpdate?: string,
  endUpdate?: string,
}

export const Filter = {
  handleQueryAggregate(q: Query) {
    const {
      rowsPerPage = 10,
      page = 0,
      startCreate,
      endCreate,
      startUpdate,
      endUpdate
    } = q

    const query: any[] = []

    const addDateFilter = (field: string, start: string, end: string) => {
      if (Validator.isTimeStampISOString(start) && Validator.isTimeStampISOString(end)) {
        query.push(
          {
            $match: {
              $expr: {
                $and: [
                   { $gte: [`$${field}`, { $dateFromString: { dateString: start } }] },
                   { $lte: [`$${field}`, { $dateFromString: { dateString: end } }] },
                ],
              }
            }
          }
        )
      }
    }

    if (startCreate && endCreate) {
      addDateFilter('createdAt', startCreate as string, endCreate as string)
    } else {
      addDateFilter('updatedAt', startUpdate as string, endUpdate as string)
    }

    const addPagination = (page: number, rowsPerPage: number) => {
      if (page >= 0 && rowsPerPage >=0) {
        const skip = page * rowsPerPage
        query.push(
          {
            $skip: skip > 0 ? skip : 0
          },
          {
            $limit: rowsPerPage
          }
        )
      }
    }

    addPagination(page as number, rowsPerPage as number)

    return query as any[]
  }
}