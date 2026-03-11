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
      const p = Number(page)
      const r = Number(rowsPerPage)
      if (p >= 0 && r >=0) {
        const skip = p * r
        query.push(
          {
            $skip: skip > 0 ? skip : 0
          },
          {
            $limit: r
          }
        )
      }
    }

    addPagination(page as number, rowsPerPage as number)

    return query as any[]
  }
}