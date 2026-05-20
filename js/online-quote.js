const CLIENT_ID = "SEU_CLIENT_ID_DO_GOOGLE";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("quoteForm");
    const message = document.getElementById("quoteMessage");
    const container = document.getElementById("services-container");
    const addServiceBtn = document.getElementById("addServiceBtn");

    let serviceCount = 0;
    const maxServices = 5; 
    const maxVideoSize = 10 * 1024 * 1024; 
    const maxTotalSize = 25 * 1024 * 1024; 

    function createServiceBlock(index) {
        const div = document.createElement("div");
        div.classList.add("service-block");
        div.innerHTML = `
            <h4>Serviço ${index + 1}</h4>
            <label for="photos_${index}">Fotos (mínimo 3):</label>
            <input type="file" id="photos_${index}" name="photos_${index}" accept="image/*" multiple required>

            <label for="measures_${index}">Medidas <br>ex.: 6m (comprimento) x 2,5m (altura):</label>
            <input type="text" id="measures_${index}" name="measures_${index}" placeholder="Informe as medidas do ambiente" required>

            <label for="description_${index}">Descrição detalhada:</label>
            <textarea id="description_${index}" name="description_${index}" rows="3" placeholder="Descreva o serviço" required></textarea>
        `;
        container.appendChild(div);
    }

    addServiceBtn.addEventListener("click", () => {
        if (serviceCount < maxServices) {
            createServiceBlock(serviceCount);
            serviceCount++;
        } else {
            alert(`Você pode adicionar no máximo ${maxServices} serviços.`);
        }
    });

    createServiceBlock(serviceCount);
    serviceCount++;

    gapi.load('client:auth2', initClient);

    function initClient() {
        gapi.client.init({
            clientId: CLIENT_ID,
            scope: SCOPES,
        });
    }

    async function uploadFileToDrive(file) {
        await gapi.auth2.getAuthInstance().signIn();

        const metadata = {
            name: file.name,
            mimeType: file.type
        };

        const accessToken = gapi.auth.getToken().access_token;
        const formData = new FormData();
        formData.append("metadata", new Blob([JSON.stringify(metadata)], {type: "application/json"}));
        formData.append("file", file);

        const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", {
            method: "POST",
            headers: new Headers({ "Authorization": "Bearer " + accessToken }),
            body: formData
        });

        const data = await response.json();

        // Torna público
        await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
            method: "POST",
            headers: new Headers({ "Authorization": "Bearer " + accessToken, "Content-Type": "application/json" }),
            body: JSON.stringify({ role: "reader", type: "anyone" })
        });

        return `https://drive.google.com/uc?id=${data.id}&export=download`;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let totalSize = 0;
        let resumo = "Novo Orçamento:\n\n";

        for (let i = 0; i < serviceCount; i++) {
            const photos = document.getElementById(`photos_${i}`).files;
            const measures = document.getElementById(`measures_${i}`).value.trim();
            const desc = document.getElementById(`description_${i}`).value.trim();

            if (!photos || photos.length < 3 || measures.length < 3 || desc.length < 10) {
                alert(`Verifique os dados do serviço ${i+1}.`);
                return;
            }

            for (let p = 0; p < photos.length; p++) totalSize += photos[p].size;
            resumo += `Serviço ${i+1}:\nMedidas: ${measures}\nDescrição: ${desc}\n`;

            for (let p = 0; p < photos.length; p++) {
                const link = await uploadFileToDrive(photos[p]);
                resumo += `Foto ${p+1}: ${link}\n`;
            }
            resumo += "\n";
        }

        const video = document.getElementById("video").files[0];
        if (!video) { alert("É necessário enviar 1 vídeo."); return; }
        totalSize += video.size;
        if (totalSize > maxTotalSize) { alert("O total dos arquivos ultrapassa 25MB."); return; }

        const linkVideo = await uploadFileToDrive(video);
        resumo += `Vídeo: ${linkVideo}`;

        // Cria link WhatsApp
        const numeroWhats = "5511999999999"; // Coloque seu número
        const linkWhats = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(resumo)}`;

        message.innerHTML = `<a href="${linkWhats}" target="_blank" class="btn btn-primary">Enviar pelo WhatsApp</a>`;

        form.reset();
        container.innerHTML = "";
        serviceCount = 0;
        createServiceBlock(serviceCount);
        serviceCount++;
    });
});
