export default function useTransaction() {
  return target => {
    target.useTransaction = true;
  };
}
