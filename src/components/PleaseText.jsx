const pleaseTextItems = [
  "観察ポイントには、個人所有のものもあります。一声かけてから観察してください。",
  "各コースには、所々に説明板を設置してあります。",
  "各コースの距離・所要時間は、ゆっくり歩いて各ポイントを観察しながらの目安です。",
  "一部足場の悪いところがあります。歩きやすい靴や動きやすい服装を心がけましょう。",
  "水分補給や休息など、体調管理は各自でお願いいたします。",
  "交通量の多いところ、見通しの悪いところがありますので、交通安全を心がけましょう。",
  "ゴミの持ち帰りなど環境美化・自然保護にご協力ください。",
];

const PleaseText = () => (
  <div>
    <h3 className="mb-1 p-1 text-center font-medium text-blue-900 text-xl">
      お願い
    </h3>
    <ol className="list-decimal list-inside space-y-2.5 line-height-relaxed p-4 text-xs rounded-md bg-gray-100 md:text-sm">
      {pleaseTextItems.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ol>
  </div>
);

export default PleaseText;
