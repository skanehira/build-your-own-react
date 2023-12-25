interface Component {
  type: string;
  props?: any | null;
  children?: any[];
}

const Diact = {
  createElement,
  render,
}

// JSXをオブジェクトに変換する
function createElement(type: string, props?: Object | null, ...children: (Component | string)[]) {
  const component: Component = {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === "object" ? children : createTextElement(child);
      }),
    }
  }
  return component
}

function createTextElement(text: string) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    }
  }
}

// 変換したオブジェクトをDOMにレンダリングする
function render(element: Component, container: HTMLElement | Text) {
  const dom: any = element.type == "TEXT_ELEMENT" ?
    document.createTextNode("") : document.createElement(element.type);

  element.props.filter((key: string) => key !== "children").forEach((name: string) => {
    dom[name] = element.props[name];
  });

  if (element.children) {
    for (const child of element.children) {
      render(child, dom);
    }
  }

  container.appendChild(dom);
}

let nextUnitOfWork: any = null;

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    // タスクを実行して、次のタスクを返す
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 残りの時間が1ms以下になったら、タスクの実行を終了して
    // 再度ブラウザがアイドル時にworkLoopを実行する
    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

// ブラウザがアイドル時にworkLoopを実行する
requestIdleCallback(workLoop);

// タスクを実行して、次に実行するタスクを返す
function performUnitOfWork(nextUnitOfWork: any) {

}

///** @jsx Didact.createElement */
//const element = (
//  <div id="foo">
//    <a>bar</a>
//    <b />
//  </div>
//)
//const container = document.getElementById("root")
//Didact.render(element, container)
