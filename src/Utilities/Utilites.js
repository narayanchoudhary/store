function formatIndianAmount(amount) {
    const roundedAmount = Math.round(Number(amount));
    const formattedAmount = roundedAmount.toLocaleString('en-IN', {
    });

    return formattedAmount;
}

export {
    formatIndianAmount
}