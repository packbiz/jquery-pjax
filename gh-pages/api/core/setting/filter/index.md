---
layout: bootstrap
title: filter
type: page
nav: nav
class: style-api style-api-detail
---

# filter
`link`パラメータに一致したアンカーリンクを絞り込みます。初期値は`function () { return /^https?:/.test(this.href) && /\/[^.]*$|\.(html?|php)$/.test(this.pathname.replace(/^\/?/, '/')); }`です。

## filter: string
jQueryセレクタによりアンカーリンクを絞り込みます。

<pre class="sh brush: js;">
$.pjax({
  filter: '*'
});
</pre>

## filter: function()
関数によりアンカーリンクを絞り込みます。

<pre class="sh brush: js;">
$.pjax({
  filter: function () { return /^https?:/.test(this.href) && /\/[^.]*$|\.(html?|php)$/.test(this.pathname.replace(/^\/?/, '/')); }
});
</pre>
