# wlw_bookmarklet

とりあえず以下をブックマークのURLの部分に書いて登録すれば使えます。
```
javascript:(function(b,c,a){null==document.getElementById(c)?(a=b.createElement("script"),a.src="https://rawgit.com/u5am1n/wlw_bookmarklet/develop/wlw_matchlog.js",a.id=c,b.body.appendChild(a)):alert("\u8907\u6570\u56de\u5b9f\u884c\u3057\u306a\u3044\u3067\u304f\u3060\u3055\u3044")})(document,"wlw_bml");
```
一応改行入れたコードも記載しておきます。

~~~~
javascript:(function(d,id,s){
  if(document.getElementById(id)==null){
    s=d.createElement("script");
    s.src="https://rawgit.com/u5am1n/wlw_bookmarklet/develop/wlw_matchlog.js";
    s.id=id;
    d.body.appendChild(s);
  }
  else{
    alert("複数回実行しないでください");
  }
})(document,"wlw_bookmarklet");
~~~~

----
