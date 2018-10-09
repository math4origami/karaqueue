<?php 
include_once "../private/template.php"; 
?>

<div class="aboutTwoCol">
  <div class="aboutLeftCol">
    <h2>What is Karaqueue?</h2>
    <p>
      Karaqueue is a website where many people can queue and watch videos from Youtube and NicoNicoDouga together.
      It also provides a rudimentary subtitle overlay while watching the videos, along with automatically added furigana.
    </p>
  </div><div class="aboutRightCol">
    <h2>「カラキュー」とは？</h2>
    <p>
      カラキューは大勢の人がYoutubeとニコニコ動画の動画を入力して一緒に見れるサイトです。ふりがな付きの字幕を加える機能もあるので、歌詞がついてない動画にも付け加えることができます。
    </p>
  </div>
</div>

<div class="aboutRow">
  <img src="images/about/search.png">
</div>

<div class="aboutTwoCol">
  <div class="aboutLeftCol">
    <h3>Search for videos</h3>
    <p>
      Press &lt;Enter&gt; after you type a query and Karaqueue will search both Youtube and NicoNicoDouga at the same time.
      Helpful search terms such as "カラオケ" (karaoke) can be added or removed by clicking on them.
    </p>
  </div><div class="aboutRightCol">
    <h3>動画を検索する</h3>
    <p>
      本サイトでテキストを入力して「Enter」を押せばYoutubeとニコニコ動画の動画を同時検索できます。タグをクリックすれば「カラオケ」などのよく検索される言葉も簡単に入力できます。
    </p>
  </div>
</div>

<div class="aboutRow">
  <img src="images/about/result.png">
</div>

<div class="aboutTwoCol">
  <div class="aboutLeftCol">
    <h3>Add videos</h3>
    <p>
      Click on a video result to add it to your queue.
    </p>
  </div><div class="aboutRightCol">
    <h3>動画をキューに入れる</h3>
    <p>
      検索結果の動画をクリックすると、動画が動画ストック（以下、キュー）に加わります。
    </p>
  </div>
</div>

<div class="aboutRow">
  <img src="images/about/watch.png">
</div>

<div class="aboutTwoCol">
  <div class="aboutLeftCol">
    <h3>Watch videos</h3>
    <p>
      Click on "Go to your Queue" to start watching your added videos.
    </p>
  </div><div class="aboutRightCol">
    <h3>動画を見る</h3>
    <p>
      「Go to your Queue」をタップすればキューにある動画を順番に見れます。
    </p>
  </div>
</div>

<div class="aboutRow">
  <img src="images/about/share.png">
</div>

<div class="aboutTwoCol">
  <div class="aboutLeftCol">
    <h3>Share and join queues</h3>
    <p>
      Share the "Join Link" with a friend so they can watch and add videos to the same queue!
      You can also join by typing the 6-digit queue_id into "Join a Queue" on the home page.
    </p>
  </div><div class="aboutRightCol">
    <h3>キューを付ける</h3>
    <p>
      「Join Link」のリンク先を友達に送ることで、友達を自分のカラキューに招待し、一緒に動画を見たり、動画をキューに入れたりできるようになります。ほかの招待方法として、ホームページの右上の「Join a Queue」に6桁の認証コードを入力することで、その人のカラキューに入ることもできます。
    </p>
  </div>
</div>

<div class="aboutRow">
  <img src="images/about/subtitles.png">
</div>

<div class="aboutTwoCol">
  <div class="aboutLeftCol">
    <h3>Add subtitles</h3>
    <p>
      Click on "Subtitles" to add and edit subtitles that can scroll over your video.
      They will have furigana automatically added.
    </p>
  </div><div class="aboutRightCol">
    <h3>字幕を加える</h3>
    <p>
      動画に字幕を加えたい場合、「Subtitles」をクリックし、動画リストをダブルクリックすれば字幕を新たに加えたり、編集したりできます。ふりがなは自動的につきます。動画が流れるときに字幕も自動的に流れます。
    </p>
  </div>
</div>

<div class="aboutRow">
  <img src="images/about/bookmarklet.png">
</div>

<div class="aboutTwoCol">
  <div class="aboutLeftCol">
    <h3>Use the bookmarklet to add videos</h3>
    <p>
      In a traditional desktop web browser, you can use the bookmarklet to add videos directly from any
      Youtube or NicoNicoDouga video page.
    </p>
  </div><div class="aboutRightCol">
    <h3>ブックマークレットを使って動画をキューに入れる</h3>
    <p>
      キューの動画入力方法をもう一つ紹介します。ブックマークレットをブラウザのブックマークに加えたあと、Youtubeかニコニコ動画の動画ページを開き、次に加えたブックマークをクリックすれば、開いてある動画がキューに加わります。
    </p>
  </div>
</div>

<div class="footer">
  <div class="footerLeft">
    <a href="https://github.com/math4origami/karaqueue">
      <img title="github.com/math4origami/karaqueue" src="images/GitHub-Mark-32px.png">
      github.com/math4origami/karaqueue
    </a>
  </div>
  <div class="footerRight">
    <a href="https://twitter.com/math4origami">
      <img title="@math4origami" src="images/Twitter_Logo_Blue.png">
      @math4origami
    </a>
  </div>
</div>

<div class="backLink">
  <a href="/">Back to Home</a>
</div>

<!-- Thanks Kotaro for the translations! -->

<?php
printFooter();
