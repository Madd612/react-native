import CompletedItems from '@/components/list/CompletedItems'
import ListHeroCard from '@/components/list/ListHeroCard'
import PendingItemCard from '@/components/list/PendingItemCard'
import TabScreenBackground from '@/components/TabScreenBackground'
import { useGroceryStore } from '@/store/grocery-store'
import { FlatList, Text, View } from 'react-native'

const index = () => {

  const { items } = useGroceryStore()
  const pendingItems = items.filter(item => !item.purchased)

  return (
    <FlatList
      className="flex-1 bg-background"
      data={pendingItems}
      keyExtractor={item => item.id}
      renderItem={({item}) => <PendingItemCard item={item} />}
      contentContainerStyle={{ gap: 14, padding: 20}}
      contentInsetAdjustmentBehavior="automatic"
      ListEmptyComponent={<Text className='uppercase text-sm text-muted-foreground'>No pending items</Text>}
      ListHeaderComponent={
        <View style={{ gap: 14, marginTop: 10 }}>
          <TabScreenBackground />
          <ListHeroCard />
          
          <View className="flex-row items-center justify-between px-1">
            <Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
              Shopping items
            </Text>
            <Text className="text-sm text-muted-foreground">{pendingItems.length} active</Text>
          </View>
        </View>
      }
      ListFooterComponent={
        <CompletedItems />
      }
    />
  )
}

export default index
