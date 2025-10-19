/* 輸入 Type */
export type BillInput = {
  date: string;
  location: string;
  tipPercentage: number;
  items: BillItem[];
};

type BillItem = SharedBillItem | PersonalBillItem;

type CommonBillItem = {
  price: number;
  name: string;
};

type SharedBillItem = CommonBillItem & {
  isShared: true;
};

type PersonalBillItem = CommonBillItem & {
  isShared: false;
  person: string;
};

/* 輸出 Type */
export type BillOutput = {
  date: string;
  location: string;
  subTotal: number;
  tip: number;
  totalAmount: number;
  items: PersonItem[];
};

type PersonItem = {
  name: string;
  amount: number;
};

/* 核心函數 */
export function splitBill(input: BillInput): BillOutput {
  let date = formatDate(input.date);
  let location = input.location;
  let subTotal = calculateSubTotal(input.items);
  let tip = calculateTip(subTotal, input.tipPercentage);
  let totalAmount = subTotal + tip;
  let items = calculateItems(input.items, input.tipPercentage);
  adjustAmount(totalAmount, items);
  return {
    date,
    location,
    subTotal,
    tip,
    totalAmount,
    items,
  };
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return `${year}年${month}月${day}日`;
}

function calculateSubTotal(items: BillItem[]): number {
  return items.reduce((total, item) => total + item.price, 0);
}

export function calculateTip(subTotal: number, tipPercentage: number): number {
  const tip = (subTotal * tipPercentage) / 100;
  return Math.round(tip * 10) / 10; // 四舍五入到最接近的 0.1
}

function scanPersons(items: BillItem[]): string[] {
  const personsSet = new Set<string>();
  items.forEach(item => {
    if (!item.isShared && item.person) {
      personsSet.add(item.person);
    }
  });
  return Array.from(personsSet);
}

function calculateItems(items: BillItem[], tipPercentage: number): PersonItem[] {
  const names = scanPersons(items);
  const persons = names.length;
  return names.map(name => ({
    name,
    amount: calculatePersonAmount({
      items,
      tipPercentage,
      name,
      persons,
    }),
  }));
}

function calculatePersonAmount(input: {
  items: BillItem[];
  tipPercentage: number;
  name: string;
  persons: number;
}): number {
  let total = 0;
  input.items.forEach(item => {
    if (item.isShared) {
      total += item.price / input.persons; // 平均分摊
    } else if (item.person === input.name) {
      total += item.price; // 个人消费
    }
  });
  const tip = (total * input.tipPercentage) / 100;
  return total + tip; // 返回总金额，包括小费
}

function adjustAmount(totalAmount: number, items: PersonItem[]): void {
  const sum = items.reduce((acc, item) => acc + item.amount, 0);
  const difference = totalAmount - sum;

  // 调整最后一个人的金额以匹配总金额
  if (items.length > 0) {
    items[items.length - 1].amount += difference;
  }
}