import { useQuery } from '@tanstack/react-query'

export type Status = ReturnType<typeof useQuery>['status']
