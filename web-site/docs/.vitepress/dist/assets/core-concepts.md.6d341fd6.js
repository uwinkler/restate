import{_ as o,c as n,a as t,b as r,w as i,d as a,e,r as c,o as d}from"./app.4a34e433.js";const N=JSON.parse('{"title":"Core Concepts","description":"","frontmatter":{},"headers":[{"level":3,"title":"Async actions and async flow","slug":"async-actions-and-async-flow","link":"#async-actions-and-async-flow","children":[]}],"relativePath":"core-concepts.md"}'),h={name:"core-concepts.md"},l=a('<h1 id="core-concepts" tabindex="-1">Core Concepts <a class="header-anchor" href="#core-concepts" aria-hidden="true">#</a></h1><p>ReState follows the three principles of <a href="https://redux.js.org/introduction/three-principles" target="_blank" rel="noreferrer">Redux</a>:</p><ul><li>Single source of truth</li><li>State is read only</li><li>Changes are made with pure functions</li></ul><h4 id="single-source-of-truth" tabindex="-1">Single source of truth <a class="header-anchor" href="#single-source-of-truth" aria-hidden="true">#</a></h4><p>Just like <code>redux</code> the state of your whole application is stored in an object tree within a single store.</p><p>What Dan Abramov statet for <code>redux</code> holds true for restate` as well:</p><blockquote> The state of your whole application is stored in an object tree within a single store. This makes it easy to create universal apps, as the state from your server can be serialized and hydrated into the client with no extra coding effort. A single state tree also makes it easier to debug or inspect an application; it also enables you to persist your app&#39;s state in development, for a faster development cycle. Some functionality which has been traditionally difficult to implement - Undo/Redo, for example - can suddenly become trivial to implement, if all of your state is stored in a single tree. </blockquote><h4 id="state-is-read-only" tabindex="-1">State is read-only <a class="header-anchor" href="#state-is-read-only" aria-hidden="true">#</a></h4><p>The state is immutable. You will get an exception if you try to bypass <code>next</code> and modify the state directly.</p><p>From <code>redux</code>:</p><blockquote><p>The only way to change the state is to emit an action, an object describing what happened.</p><p>This ensures that neither the views nor the network callbacks will ever write directly to the state. Instead, they express an intent to transform the state. Because all changes are centralized and happen one by one in a strict order, there are no subtle race conditions to watch out for. As actions are just plain objects, they can be logged, serialized, stored, and later replayed for debugging or testing purposes.</p></blockquote><p>In <code>restate</code> you don&#39;t write actions yourself. You create actions with the <code>next</code> function. You express the intent how you want to transform the state in an imperative way by modifying a copy (draft) of the current state. Using immer.js, the <code>next</code> function figures how to patch the current state.</p><p>If you want, <code>store.state$</code> is nothing else than a stream of those actions containing the patches, which created the current state.</p>',13),u=e("Of course you can write actions in a more "),p=t("code",null,"redux",-1),f=e(" like fashion. You can do so using the "),m=t("code",null,"messageBus$",-1),g=e(" and "),_=e("glue-code"),y=e(". The "),b=t("code",null,"messageBus$",-1),w=e(" would dispatch the action object and the glue-code would become the equivalent of an "),x=t("code",null,"react",-1),k=e(" reducer, modifying state using the "),v=t("code",null,"next",-1),T=e(" function."),C=a(`<h4 id="changes-are-made-with-pure-functions" tabindex="-1">Changes are made with pure functions <a class="header-anchor" href="#changes-are-made-with-pure-functions" aria-hidden="true">#</a></h4><p>From <code>redux</code>:</p><blockquote> To specify how the state tree is transformed by actions, you write pure reducers. Reducers are just pure functions that take the previous state and an action, and return the next state. Remember to return new state objects, instead of mutating the previous state. You can start with a single reducer, and as your app grows, split it off into smaller reducers that manage specific parts of the state tree. Because reducers are just functions, you can control the order in which they are called, pass additional data, or even make reusable reducers for common tasks such as pagination. </blockquote><p>In <code>restate</code> the equivalent of reducers are those tiny callback functions you put into <code>next</code>:</p><div class="language- line-numbers-mode"><button class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">  store.next(state =&gt; state.name = &#39;John Tagaryan&#39;)</span></span>
<span class="line"><span style="color:#A6ACCD;">//            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</span></span>
<span class="line"><span style="color:#A6ACCD;">//              This is your reducer function</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>Those callback function take a draft of the current state as parameter and modify the draft to provide the intent how the next state should look like.</p><h1 id="what-distinguishes-restate-from-redux" tabindex="-1">What distinguishes restate from redux? <a class="header-anchor" href="#what-distinguishes-restate-from-redux" aria-hidden="true">#</a></h1><h3 id="async-actions-and-async-flow" tabindex="-1">Async actions and async flow <a class="header-anchor" href="#async-actions-and-async-flow" aria-hidden="true">#</a></h3><p>One of the most trickiest part of redux is to figure out how to write <strong>asynchronous actions and reducers</strong>. Without middleware, (this is not possible)[<a href="https://redux.js.org/advanced/async-flow" target="_blank" rel="noreferrer">https://redux.js.org/advanced/async-flow</a>]. The community developed numerous projects to overcome this problem: (redux-hunk)[<a href="https://github.com/reduxjs/redux-thunk" target="_blank" rel="noreferrer">https://github.com/reduxjs/redux-thunk</a>], (redux-promise)[<a href="https://github.com/redux-utilities/redux-promise" target="_blank" rel="noreferrer">https://github.com/redux-utilities/redux-promise</a>], or (redux-saga)[<a href="https://github.com/redux-saga/redux-saga" target="_blank" rel="noreferrer">https://github.com/redux-saga/redux-saga</a>], to name just a few of them.</p><p>Writing asynchronous code is very straight forward in <code>restate</code>.</p>`,10);function A(j,S,q,D,I,V){const s=c("Link");return d(),n("div",null,[l,t("p",null,[u,p,f,m,g,r(s,{to:"/glue-code"},{default:i(()=>[_]),_:1}),y,b,w,x,k,v,T]),C])}const R=o(h,[["render",A]]);export{N as __pageData,R as default};
