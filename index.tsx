import {
  Accessor,
  createEffect,
  createSignal,
  For,
  JSX,
  onCleanup,
  onMount,
  Show,
} from "solid-js";

export default function InfiniteScroll<T, U extends JSX.Element>(props: {
  each: readonly T[] | undefined | null | false;
  children: (item: T, index: Accessor<number>) => U;
  next: () => any;
  hasMore: boolean;
  loadingMessage?: JSX.Element;
  endMessage?: JSX.Element;
  scrollTreshold?: number;
}) {
  let observerRef: any;

  const [loading, setLoading] = createSignal(false);

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (props.hasMore) {
          setLoading(true);
          props.next();
        }
      } else {
        setLoading(false);
      }
    });

    observer.observe(observerRef);

    onCleanup(() => {
      observer.unobserve(observerRef);
    });
  });

  const observerObjectHeight = !props.scrollTreshold
    ? "50px"
    : props.scrollTreshold + "px";

  createEffect(() => {
    if (!props.hasMore) {
      setLoading(false);
    }
  });

  return (
    <>
      <For each={props.each} children={props.children} />
      <div
        ref={observerRef}
        style={{
          height: observerObjectHeight,
          "margin-top": "-" + observerObjectHeight,
        }}
      />
      <Show
        when={loading()}
        children={props.loadingMessage || <div>Loading...</div>}
      />
      <Show when={!props.hasMore} children={props.endMessage} />
    </>
  );
}
