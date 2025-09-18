// API endpoints

const API_BASE_URL = 'http://localhost:8080';
const TEAMS_API = `${API_BASE_URL}/timovi`;
const PLAYERS_API = `${API_BASE_URL}/igraci`;

// Globalne promenljive za čuvanje podataka
let teams = [];
let players = [];
let currentPlayerId = null;

// Funkcija za prikaz notifikacije
function showToast(message, type = 'info') {
    // Kreiraj toast element ako već ne postoji
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        info: 'fa-info-circle',
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Automatsko uklanjanje notifikacije nakon 5 sekundi
    setTimeout(() => {
        toast.remove();
    }, 5000);
    
    // Rukovanje klikom na dugme za zatvaranje
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
}

// Poboljšana funkcija za učitavanje timova
async function loadTeams() {
    const teamsContainer = document.getElementById('teamsContainer');
    teamsContainer.innerHTML = `
        <div class="loading">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Učitavanje...</span>
            </div>
        </div>
    `;
    
    try {
        const response = await fetch(TEAMS_API);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        teams = await response.json();
        displayTeams(teams);
        populateTeamDropdowns();
    } catch (error) {
        console.error('Greška pri učitavanju timova:', error);
        teamsContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Došlo je do greške pri učitavanju timova.</p>
                <button class="btn btn-primary mt-2" onclick="loadTeams()">
                    <i class="fas fa-refresh me-1"></i> Pokušaj ponovo
                </button>
            </div>
        `;
        showToast('Došlo je do greške pri učitavanju timova. Proverite da li je server pokrenut.', 'error');
    }
}

// Funkcija za učitavanje igrača
async function loadPlayers() {
    const playersTableBody = document.getElementById('playersTableBody');
    playersTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center">
                <div class="loading">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Učitavanje...</span>
                    </div>
                </div>
            </td>
        </tr>
    `;
    
    try {
        const response = await fetch(PLAYERS_API);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        players = await response.json();
        displayPlayers(players);
    } catch (error) {
        console.error('Greška pri učitavanju igrača:', error);
        playersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <p class="text-danger">Došlo je do greške pri učitavanju igrača.</p>
                    <button class="btn btn-primary mt-2" onclick="loadPlayers()">
                        <i class="fas fa-refresh me-1"></i> Pokušaj ponovo
                    </button>
                </td>
            </tr>
        `;
        showToast('Došlo je do greške pri učitavanju igrača. Proverite da li je server pokrenut.', 'error');
    }
}

// Funkcija za prikaz timova
function displayTeams(teamsData) {
    const teamsContainer = document.getElementById('teamsContainer');
    
    if (teamsData.length === 0) {
        teamsContainer.innerHTML = '<p class="text-center">Nema dostupnih timova.</p>';
        return;
    }
    
    teamsContainer.innerHTML = teamsData.map(team => `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="card team-card p-3">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="m-0">${team.nazivTima}</h5>
                    <span class="badge bg-primary">${team.gradTima}</span>
                </div>
                <p class="text-muted mb-1">Osnovan: ${team.godinaOsnivanja}.</p>
                <p class="mb-2">Broj igrača: ${team.igraci ? team.igraci.length : 0}</p>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editTeam(${team.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTeam(${team.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Funkcija za prikaz igrača
function displayPlayers(playersData) {
    const playersTableBody = document.getElementById('playersTableBody');
    
    if (playersData.length === 0) {
        playersTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nema dostupnih igrača.</td></tr>';
        return;
    }
    
    playersTableBody.innerHTML = playersData.map(player => `
        <tr>
            <td>${player.imeIgraca}</td>
            <td><span class="badge bg-primary">${player.position}</span></td>
            <td>${player.age}</td>
            <td>${player.tim ? player.tim.nazivTima : 'Nepoznato'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editPlayer(${player.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deletePlayer(${player.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Funkcija za popunjavanje padajućih menija timovima
function populateTeamDropdowns() {
    const playerTeam = document.getElementById('playerTeam');
    const editPlayerTeam = document.getElementById('editPlayerTeam');
    
    // Očisti postojeće opcije (zadržavajući prvu)
    while (playerTeam.options.length > 1) playerTeam.remove(1);
    while (editPlayerTeam.options.length > 1) editPlayerTeam.remove(1);
    
    // Dodaj timove u padajuće menije
    teams.forEach(team => {
        playerTeam.appendChild(new Option(team.nazivTima, team.id));
        editPlayerTeam.appendChild(new Option(team.nazivTima, team.id));
    });
}

// Funkcija za dodavanje tima
async function addTeam() {
    const teamName = document.getElementById('teamName').value;
    const teamCity = document.getElementById('teamCity').value;
    const teamYear = document.getElementById('teamYear').value;
    
    // Validacija
    if (!teamName || !teamCity || !teamYear) {
        showToast('Molimo popunite sva polja.', 'error');
        return;
    }
    
    const teamData = {
        nazivTima: teamName,
        gradTima: teamCity,
        godinaOsnivanja: parseInt(teamYear)
    };
    
    try {
        const response = await fetch(TEAMS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(teamData)
        });
        
        if (response.ok) {
            showToast('Tim je uspešno dodat!', 'success');
            document.getElementById('addTeamForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('addTeamModal')).hide();
            loadTeams();
        } else {
            showToast('Došlo je do greške pri dodavanju tima.', 'error');
        }
    } catch (error) {
        console.error('Greška pri dodavanju tima:', error);
        showToast('Došlo je do greške pri dodavanju tima.', 'error');
    }
}

// Funkcija za dodavanje igrača
async function addPlayer() {
    const playerName = document.getElementById('playerName').value;
    const playerPosition = document.getElementById('playerPosition').value;
    const playerAge = document.getElementById('playerAge').value;
    const playerTeam = document.getElementById('playerTeam').value;
    
    // Validacija
    if (!playerName || !playerPosition || !playerAge || !playerTeam) {
        showToast('Molimo popunite sva polja.', 'error');
        return;
    }
    
    const playerData = {
        imeIgraca: playerName,
        position: playerPosition,
        age: parseInt(playerAge),
        tim: { id: parseInt(playerTeam) }
    };
    
    try {
        const response = await fetch(PLAYERS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerData)
        });
        
        if (response.ok) {
            showToast('Igrač je uspešno dodat!', 'success');
            document.getElementById('addPlayerForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('addPlayerModal')).hide();
            loadPlayers();
        } else {
            showToast('Došlo je do greške pri dodavanju igrača.', 'error');
        }
    } catch (error) {
        console.error('Greška pri dodavanju igrača:', error);
        showToast('Došlo je do greške pri dodavanju igrača.', 'error');
    }
}

// Funkcija za brisanje tima
async function deleteTeam(teamId) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj tim?')) return;
    
    try {
        const response = await fetch(`${TEAMS_API}/${teamId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Tim je uspešno obrisan!', 'success');
            loadTeams();
        } else {
            showToast('Došlo je do greške pri brisanju tima.', 'error');
        }
    } catch (error) {
        console.error('Greška pri brisanju tima:', error);
        showToast('Došlo je do greške pri brisanju tima.', 'error');
    }
}

// Funkcija za brisanje igrača
async function deletePlayer(playerId) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovog igrača?')) return;
    
    try {
        const response = await fetch(`${PLAYERS_API}/${playerId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Igrač je uspešno obrisan!', 'success');
            loadPlayers();
        } else {
            showToast('Došlo je do greške pri brisanju igrača.', 'error');
        }
    } catch (error) {
        console.error('Greška pri brisanju igrača:', error);
        showToast('Došlo je do greške pri brisanju igrača.', 'error');
    }
}

// Funkcija za uređivanje igrača
async function editPlayer(playerId) {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    document.getElementById('editPlayerId').value = player.id;
    document.getElementById('editPlayerName').value = player.imeIgraca;
    document.getElementById('editPlayerPosition').value = player.position;
    document.getElementById('editPlayerAge').value = player.age;
    document.getElementById('editPlayerTeam').value = player.tim ? player.tim.id : '';
    
    currentPlayerId = playerId;
    const editModal = new bootstrap.Modal(document.getElementById('editPlayerModal'));
    editModal.show();
}

// Funkcija za ažuriranje igrača
async function updatePlayer() {
    const playerName = document.getElementById('editPlayerName').value;
    const playerPosition = document.getElementById('editPlayerPosition').value;
    const playerAge = document.getElementById('editPlayerAge').value;
    const playerTeam = document.getElementById('editPlayerTeam').value;
    
    // Validacija
    if (!playerName || !playerPosition || !playerAge || !playerTeam) {
        showToast('Molimo popunite sva polja.', 'error');
        return;
    }
    
    const playerData = {
        imeIgraca: playerName,
        position: playerPosition,
        age: parseInt(playerAge),
        tim: { id: parseInt(playerTeam) }
    };
    
    try {
        const response = await fetch(`${PLAYERS_API}/${currentPlayerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerData)
        });
        
        if (response.ok) {
            showToast('Igrač je uspešno ažuriran!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editPlayerModal')).hide();
            loadPlayers();
        } else {
            showToast('Došlo je do greške pri ažuriranju igrača.', 'error');
        }
    } catch (error) {
        console.error('Greška pri ažuriranju igrača:', error);
        showToast('Došlo je do greške pri ažuriranju igrača.', 'error');
    }
}

// Funkcija za uređivanje tima
function editTeam(teamId) {
    alert('Funkcionalnost izmene tima će biti implementirana u narednoj verziji.');
}

// Inicijalizacija aplikacije
document.addEventListener('DOMContentLoaded', function() {
    // Učitaj podatke
    loadTeams();
    loadPlayers();
    
    // Postavi event listenere
    document.getElementById('saveTeamBtn').addEventListener('click', addTeam);
    document.getElementById('savePlayerBtn').addEventListener('click', addPlayer);
    document.getElementById('updatePlayerBtn').addEventListener('click', updatePlayer);
    
    // Resetuj forme kada se modali zatvore
    document.getElementById('addTeamModal').addEventListener('hidden.bs.modal', function() {
        document.getElementById('addTeamForm').reset();
    });
    
    document.getElementById('addPlayerModal').addEventListener('hidden.bs.modal', function() {
        document.getElementById('addPlayerForm').reset();
    });
    
    document.getElementById('editPlayerModal').addEventListener('hidden.bs.modal', function() {
        document.getElementById('editPlayerForm').reset();
    });
});