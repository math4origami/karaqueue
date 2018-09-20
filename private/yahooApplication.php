<?php
include_once "constant.php";

class YahooApplication {
  public function getYahooApplicationId() {
    $constant = Constant::load("yahooApplicationId");
    if ($constant) {
      return $constant->value;
    }
    return "";
  }

  public function getYahooApplicationSecret() {
    $constant = Constant::load("yahooApplicationSecret");
    if ($constant) {
      return $constant->value;
    }
    return "";
  }

  public function getFurigana($sentence) {
    $sentence = urlencode($sentence);
    $appId = $this->getYahooApplicationId();
    $url = "http://jlp.yahooapis.jp/FuriganaService/V1/furigana?appid=$appId&grade=1&sentence=$sentence";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $xmlText = curl_exec($ch);
    curl_close($ch);

    $xml = new SimpleXMLElement($xmlText);
    if (!isset($xml->Result)) {
      return null;
    }

    $words = array();
    foreach ($xml->Result->WordList->Word as $word) {
      if (isset($word->Furigana)) {
        $furigana = strval($word->Furigana);
      } else {
        $furigana = "";
      }
      $words[] = array(strval($word->Surface), $furigana);
    }

    return $words;
  }
}
