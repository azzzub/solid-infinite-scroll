# solid-infinite-scroll

Infinite scrolling / Dynamic list loading library for SolidJS

### Installation

First, install the library from the npm registry:

```sh
yarn add -D solid-infinite-scroll
```

Second, import it in the tsx component you're working on:

```tsx
import InfiniteScroll from 'solid-infinite-scroll';
```

### Usage

To use the infinite scroll module, you would need a signal/resource for data storage, and implement two functions: 

* `each` should return the currently stored data array, this is similar to the SolidJS `<For>` component
* `hasMore` should return true if more data is available
* `next` should load more data into the array stored by `each` and return nothing

For example, if you want to load all data at once but only display e.g. 50 at a time, you can do:

```tsx
const fetchApi = async () => await (await fetch("https://api.example.com/list").json() as string[]

export default function App() {
  const [api] = createResource(fetchApi)
  
  const [scrollIndex, setScrollIndex] = createSignal(50)
  const scrollNext = () => setScrollIndex(Math.min(scrollIndex() + 50, api().length))
  
  return (
    <InfiniteScroll each={api()?.slice(0, scrollIndex())} 
      hasMore={scrollIndex() < api()?.length}
      next={scrollNext}>
      {(item, index) =>
        <div>{item}</div>
      }
    </InfiniteScroll>
  )
}
```
