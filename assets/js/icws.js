---
---

    console.log('==> icws.js loaded');

// Usage: const updateSelectOptions = createSelectUpdater({ wsUrl: '{{ site.wsUrl }}', wsSecret: '{{ site.wsSecret }}' });
const createSelectUpdater = ({ wsUrl, wsSecret }) => {
    // function to populate select options. Usage: updateSelectOptions('select_id', 'select_path', valPos, textPos)
    return function updateSelectOptions(select_id, select_path, valPos, textPos) {

        console.log(`==> Calling... ${wsUrl}${select_path} for select: ${select_id}`);

        fetch(wsUrl + select_path, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + wsSecret
            }
        })
            .then(response => response.json())
            .then(data => {

                data.shift(); // remove header

                const uniqueSorted = [...new Set(data)].sort();

                console.log(
                    'Data retrieved:',
                    data,
                    data.length,
                    uniqueSorted.length
                );

                const select = document.getElementById(select_id);

                // optional: clear previous options
                select.innerHTML = '';

                uniqueSorted.reduce((acc, row) => {

                    const cols = row.split(";");

                    const value = cols[valPos];
                    const text = cols[textPos];

                    // keep first occurrence only
                    if (!acc[value]) {

                        acc[value] = true;

                        const option = document.createElement('option');

                        option.value = value;
                        option.textContent = `${text} (${value})`;

                        select.appendChild(option);
                    }

                    return acc;

                }, {});
            })
            .catch(error =>
                console.error(
                    'Error fetching data for select:',
                    select_id,
                    error
                )
            );
    };
};

// autopopulate select options if page.wsSelectId and page.wsSelectPath are defined
if (typeof wsSelectId !== 'undefined') {
    console.log('Loading Data for Select Options: {{ site.wsUrl }}', wsSelectId, wsSelectPath, 0, 1);
    const updateSelectOptions = createSelectUpdater({
        wsUrl: '{{ site.wsUrl }}',
        wsSecret: '{{ site.wsSecret }}'
    });
    updateSelectOptions(wsSelectId, wsSelectPath, 0, 1);
}
