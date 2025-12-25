export const ORDER_STATUS: { [key: string]: string } = {
  'PENDING': 'Đang chờ xử lý',
  'COMPLETED': 'Đã hoàn thành',
  'FAILED': 'Thất bại'
};

export const PAYMENT_STATUS: { [key: string]: string } = {
  'UNPAID': 'Chưa thanh toán',
  'PAID': 'Đã thanh toán',
  'PENDING': 'Chưa hoàn thành',
  'SUCCESS': 'Thành công',
  'FAILURE': 'Thất bại',
};

export const PAYMENT_METHOD: { [key: string]: string } = {
  'pay_os': 'PayOS',
  'SYSTEM': 'Hệ thống',
};

export const PAYMENT_TYPE: { [key: number]: string } = {
  1: 'Khách đặt đơn hàng',
  2: 'Cộng tiền đơn hàng',
  3: 'Trừ phí sàn',
  4: 'Hoàn tiền cho khách hàng',
};

export const PRODUCT_STATUS: { [key: string]: string } = {
  'ACTIVE': 'Đang hoạt động',
  'INACTIVE': 'Dừng hoạt động',
};

export const VOUCHER_TYPE: { [key: number]: string } = {
  1: 'Giảm giá theo giá trị',
  2: 'Giảm giá theo phần trăm',
};

export const VOUCHER_STATUS: { [key: number]: string } = {
  1: 'Đang hoạt động',
  0: 'Không hoạt động',
};
