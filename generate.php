<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    function delFolder($dir)
    {
        $files = array_diff(scandir($dir), array('.', '..'));
        foreach ($files as $file) {
            (is_dir("$dir/$file")) ? delFolder("$dir/$file") : unlink("$dir/$file");
        }
        return rmdir($dir);
    }

    $name = $_POST['name'];
    $title = $_POST['title'];
    $subtitle = $_POST['subtitle'];
    $product = $_POST['product'];
    $img1 = $_POST['img1'];
    $img2 = $_POST['img2'];
    $desc = $_POST['desc'];
    $youtube = $_POST['youtube'];
    $siteName = $_POST['sitename'];
    $path = "/var/www/fintech/sites/" . $siteName;
    delFolder($path);

    if (!mkdir($path, 0777, true)) {
        die('Не удалось создать директории...');
    }

    exec("cp -rp /var/www/fintech/template/* " . $path . "/");

    $template = file_get_contents($path . "/index.html");
    $template = str_replace('{product}', $product, $template);
    $template = str_replace('{name}', $name, $template);
    $template = str_replace('{title}', $title, $template);
    $template = str_replace('{subtitle}', $subtitle, $template);
    $template = str_replace('{descr}', $desc, $template);
    $template = str_replace('{img1}', $img1, $template);
    $template = str_replace('{img2}', $img2, $template);
    $template = str_replace('{youtube}', $youtube, $template);
    file_put_contents($path . "/index.html", $template);

} else {
    exit("кыш мошейник");
}