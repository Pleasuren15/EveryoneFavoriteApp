import { useQuery, useMutation } from "@apollo/client/react"
import { useAuth } from "./auth-context"
import {
  GET_USER_CATEGORIES,
  GET_CATEGORIES,
  SET_USER_CATEGORIES,
} from "./operations"

interface CategoryInfo {
  id: string
  name: string
  label: string
}

export function useUserCategories() {
  const { user } = useAuth()
  const userId = user?.id

  const {
    data: catData,
    loading: catLoading,
  } = useQuery(GET_CATEGORIES, {
    skip: !userId,
  })

  const {
    data: userCatData,
    loading: userCatLoading,
    refetch: refetchUserCategories,
  } = useQuery(GET_USER_CATEGORIES, {
    variables: { userId },
    skip: !userId,
  })

  const [setUserCategoriesMut] = useMutation(SET_USER_CATEGORIES)

  const allCategories: CategoryInfo[] = (catData as any)?.categories ?? []
  const selectedCategoryIds: string[] = (userCatData as any)?.userCategories ?? []
  const loading = catLoading || userCatLoading
  const hasSelections = selectedCategoryIds.length > 0

  const setSelectedCategories = async (categoryIds: string[]) => {
    if (!userId) return
    await setUserCategoriesMut({
      variables: {
        input: {
          userId,
          categoryIds,
        },
      },
    })
    await refetchUserCategories()
  }

  return {
    allCategories,
    selectedCategoryIds,
    loading,
    hasSelections,
    setSelectedCategories,
    refetchUserCategories,
  }
}
